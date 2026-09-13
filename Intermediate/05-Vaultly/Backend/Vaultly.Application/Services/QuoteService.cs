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
        Task<QuoteDto>                      CreateQuoteAsync(string freelancerId, CreateQuoteDto dto);
        Task<List<QuoteDto>>                GetQuotesAsync(string userId);
        Task<(bool success, string? error)> TransitionStatusAsync(int quoteId, QuoteStatus newStatus, string userId);
    }

    public class QuoteService: IQuoteService
    {
        private readonly IQuoteReader       _reader;
        private readonly IQuoteWriter       _writer;
        private readonly IQuoteCalculator   _calculator;
        private readonly IQuoteStateManager _stateManager;

        public QuoteService(
            IQuoteReader reader, 
            IQuoteWriter writer, 
            IQuoteCalculator calculator, 
            IQuoteStateManager stateManager)
        {
            _reader         = reader;
            _writer         = writer;
            _calculator     = calculator;
            _stateManager   = stateManager;
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
            if(quote is null) { return (false, "العرض غير موجود."); }
            if (quote.FreelancerId != userId) { return (false, "لا تملك صلاحية على هذا العرض."); }

            if (!_stateManager.CanTransition(quote.Status, newStatus)) { return (false, $"لا يمكن الانتقال من {quote.Status} إلى {newStatus}."); }

            quote.Status = newStatus;
            await _writer.SaveChangesAsync();
            return (false, null);
        }

        private QuoteDto MapToDto(Quote quote)
        {
            var(subtotal, tax, total) = _calculator.Calculate(quote);

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
