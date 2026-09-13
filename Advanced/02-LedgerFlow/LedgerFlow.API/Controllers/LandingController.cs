using LedgerFlow.API.Data;
using LedgerFlow.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LedgerFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LandingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LandingController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalTransactions = await _context.Transactions.CountAsync();
            var totalRevenue = await _context.Transactions.Where(t => t.Amount > 0).SumAsync(t => t.Amount);
            var totalExpenses = await _context.Transactions.Where(t => t.Amount < 0).SumAsync(t => Math.Abs(t.Amount));

            return Ok(new GeneralStatsDto
            {
                TotalUsers = totalUsers,
                TotalTransactions = totalTransactions,
                TotalRevenue = totalRevenue,
                TotalExpenses = totalExpenses
            });
        }

        [HttpGet("recent-transactions")]
        public async Task<IActionResult> GetRecentTransactions(int count = 5)
        {
            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .OrderByDescending(t => t.OccurredAt)
                .Take(count)
                .Select(t => new PublicTransactionDto
                {
                    Id = t.Id,
                    Amount = t.Amount,
                    Description = t.Description,
                    CategoryName = t.Category.Name,
                    OccurredAt = t.OccurredAt
                })
                .ToListAsync();

            return Ok(transactions);
        }
    }
}