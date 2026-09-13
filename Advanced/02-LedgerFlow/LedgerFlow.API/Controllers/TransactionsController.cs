using LedgerFlow.API.Data;
using LedgerFlow.API.DTOs;
using LedgerFlow.API.Features.Queries;
using LedgerFow.API.Features.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LedgerFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly AppDbContext _context;

        public TransactionsController(IMediator mediator, AppDbContext context)
        {
            _mediator = mediator;
            _context = context;
        }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetTransactions([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] DateTime? from = null, [FromQuery] DateTime? to = null)
        {
            var query = _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.OwnerId == GetCurrentUserId());

            if (from.HasValue)
                query = query.Where(t => t.OccurredAt >= from.Value);
            if (to.HasValue)
                query = query.Where(t => t.OccurredAt <= to.Value);

            query = query.OrderByDescending(t => t.OccurredAt);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new TransactionDto
                {
                    Id = t.Id,
                    Amount = t.Amount,
                    CategoryName = t.Category.Name,
                    OccurredAt = t.OccurredAt,
                    Description = t.Description,
                })
                .ToListAsync();

            var result = new PaginatedResult<TransactionDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
            return Ok(result);
        }

        [HttpGet("{id}/details")]
        public async Task<IActionResult> GetDetails(int id)
        {
            var t = await _context.Transactions
                .Include(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (t == null) return NotFound();
            if (t.OwnerId != GetCurrentUserId()) return Forbid();
            return Ok(new TransactionDto
            {
                Id = t.Id,
                Amount = t.Amount,
                CategoryName = t.Category.Name,
                Description = t.Description,
                OccurredAt = t.OccurredAt
            });
        }

        [HttpPost]
        public async Task<IActionResult> BoardTransaction(RecordTransactionDto dto)
        {
            var id = await _mediator.Send(new RecordTransactionCommand(GetCurrentUserId(), dto.CategoryId, dto.Amount, dto.Description));
            return Ok(new { id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, UpdateTransactionDto dto)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null) return NotFound();
            if (transaction.OwnerId != GetCurrentUserId()) return Forbid();

            if (dto.CategoryId.HasValue)
                transaction.CategoryId = dto.CategoryId.Value;
            if (dto.Amount.HasValue)
                transaction.Amount = dto.Amount.Value;
            if (dto.Description != null)
                transaction.Description = dto.Description;
            if (dto.OccurredAt.HasValue)
                transaction.OccurredAt = dto.OccurredAt.Value;

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم التحديث بنجاح" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null) return NotFound();
            if (transaction.OwnerId != GetCurrentUserId()) return Forbid();
            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم الحذف بنجاح" });
        }

        [HttpGet("balance")]
        public async Task<IActionResult> GetBalance()
        {
            var balance = await _mediator.Send(new GetBalanceQuery(GetCurrentUserId()));
            return Ok(new { balance });
        }
    }
}