using System;
using System.Collections.Generic;
using System.Text;
using Vaultly.Application.DTOs.Quotes;
using Vaultly.Application.Interfaces;
using Vaultly.Domain.Entities;
using Vaultly.Domain.Enums;
using Vaultly.Domain.Services;

namespace Vaultly.Application.Services
{
    public interface IQuoteService
    {
        Task<QuoteDto> CreateQuoteAsync(string freelancerId, CreateQuoteDto dto);
        Task<List<QuoteDto>> GetQuotesAsync(string userId);
        Task<(bool success, string? error)> TransitionStatusAsync(int quoteId, QuoteStatus newStatus, string userId);
        Task<(bool success, string? error, string? token)> SendQuoteAsync(int quoteId, string userId);
        Task<PublicQuoteDto?> GetPublicQuoteAsync(string token);
        Task<(bool success, string? error)> RespondToQuoteAsync(string token, RespondToQuoteDto dto);
        Task<(bool success, string? error)> DeleteQuoteAsync(int quoteId, string userId);

    }

    public class QuoteService : IQuoteService
    {
        private readonly IQuoteReader _reader;
        private readonly IQuoteWriter _writer;
        private readonly IQuoteCalculator _calculator;
        private readonly IQuoteStateManager _stateManager;

        public QuoteService(
            IQuoteReader reader,
            IQuoteWriter writer,
            IQuoteCalculator calculator,
            IQuoteStateManager stateManager)
        {
            _reader = reader;
            _writer = writer;
            _calculator = calculator;
            _stateManager = stateManager;
        }

        public async Task<QuoteDto> CreateQuoteAsync(string freelancerId, CreateQuoteDto dto)
        {
            var quote = new Quote
            {
                ClientName = dto.ClientName,
                ClientEmail = dto.ClientEmail,
                TaxType = dto.TaxType,
                FreelancerId = freelancerId,
                LineItems = dto.LineItems.Select(li => new QuoteLineItem
                {
                    Description = li.Description,
                    UnitPrice = li.UnitPrice,
                    Quantity = li.Quantity
                }).ToList()
            };

            await _writer.AddAsync(quote);
            await _writer.SaveChangesAsync();

            return MapToDto(quote);
        }

        public async Task<List<QuoteDto>> GetQuotesAsync(string userId)
        {
            var quotes = await _reader.GetAllForUserAsync(userId);
            return quotes.Select(MapToDto).ToList();
        }

        public async Task<(bool success, string? error)> TransitionStatusAsync(int quoteId, QuoteStatus newStatus, string userId)
        {
            var quote = await _reader.GetByIdAsync(quoteId);
            if (quote is null) { return (false, "العرض غير موجود."); }
            if (quote.FreelancerId != userId) { return (false, "لا تملك صلاحية على هذا العرض."); }

            if (!_stateManager.CanTransition(quote.Status, newStatus)) { return (false, $"لا يمكن الانتقال من {quote.Status} إلى {newStatus}."); }

            quote.Status = newStatus;
            await _writer.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool success, string? error, string? token)> SendQuoteAsync(int quoteId, string userId)
        {
            var quote = await _reader.GetByIdAsync(quoteId);
            if (quote is null) { return (false, "العرض غير موجود.", null); }
            if (quote.FreelancerId != userId) { return (false, "لا تملك صلاحية على هذا العرض.", null); }

            if (quote.Status != QuoteStatus.Draft)
                return (false, "العرض مُرسل بالفعل.", quote.PublicToken);

            if (quote.LineItems.Count == 0)
                return (false, "لا يمكن إرسال عرض بدون بنود.", null);

            quote.PublicToken = Guid.NewGuid().ToString("N");
            quote.Status = QuoteStatus.Sent;
            quote.SentAt = DateTime.UtcNow;

            await _writer.SaveChangesAsync();
            return (true, null, quote.PublicToken);
        }

        public async Task<PublicQuoteDto?> GetPublicQuoteAsync(string token)
        {
            var quote = await _reader.GetByPublicTokenAsync(token);
            if (quote is null) return null;

            if (quote.ClientViewedAt is null)
            {
                quote.ClientViewedAt = DateTime.UtcNow;
                await _writer.SaveChangesAsync();
            }

            var (subtotal, tax, total) = _calculator.Calculate(quote);

            return new PublicQuoteDto
            {
                FreelancerName = quote.Freelancer?.FullName ?? string.Empty,
                ClientName = quote.ClientName,
                ClientEmail = quote.ClientEmail,
                Status = quote.Status.ToString(),
                TaxType = quote.TaxType.ToString(),
                CreatedAt = quote.CreatedAt,
                SentAt = quote.SentAt,
                ClientNote = quote.ClientNote,
                Subtotal = subtotal,
                Tax = tax,
                Total = total,
                LineItems = quote.LineItems.Select(li => new PublicQuoteLineItemDto
                {
                    Description = li.Description,
                    Quantity = li.Quantity,
                    Subtotal = li.Subtotal,
                    UnitPrice = li.UnitPrice
                }).ToList()
            };
        }

        public async Task<(bool success, string? error)> RespondToQuoteAsync(string token, RespondToQuoteDto dto)
        {
            var quote = await _reader.GetByPublicTokenAsync(token);
            if (quote is null) return (false, "العرض غير موجود.");

            if (quote.Status != QuoteStatus.Sent)
                return (false, "لا يمكن الرد على هذا العرض في حالته الحالية.");

            var target = dto.Accepted ? QuoteStatus.Accepted : QuoteStatus.Rejected;
            if (!_stateManager.CanTransition(quote.Status, target))
                return (false, "الانتقال غير مسموح.");

            quote.Status = target;
            quote.ClientRespondedAt = DateTime.UtcNow;
            quote.ClientNote = dto.Note;

            await _writer.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool success, string? error)> DeleteQuoteAsync(int quoteId, string userId)
        {
            var quote = await _reader.GetByIdAsync(quoteId);
            if (quote is null) return (false, "العرض غير موجود.");
            if (quote.FreelancerId != userId) return (false, "لا تملك صلاحية على هذا العرض.");

            _writer.Remove(quote);
            await _writer.SaveChangesAsync();
            return (true, null);
        }

        private QuoteDto MapToDto(Quote quote)
        {
            var (subtotal, tax, total) = _calculator.Calculate(quote);

            return new QuoteDto
            {
                Id = quote.Id,
                ClientName = quote.ClientName,
                ClientEmail = quote.ClientEmail,
                Status = quote.Status.ToString(),
                TaxType = quote.TaxType.ToString(),
                Subtotal = subtotal,
                Tax = tax,
                Total = total,
                PublicToken = quote.PublicToken,
                LineItems = quote.LineItems.Select(li => new QuoteLineItemDto
                {
                    Id = li.Id,
                    Description = li.Description,
                    Quantity = li.Quantity,
                    Subtotal = li.Subtotal,
                    UnitPrice = li.UnitPrice
                }).ToList()
            };
        }
    }
}