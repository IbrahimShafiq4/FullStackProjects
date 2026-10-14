using MarketPulse.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MarketPulse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DashboardController(AppDbContext context) => _context = context;

        private string CurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("seller")]
        public async Task<IActionResult> Seller()
        {
            var userId = CurrentUserId();

            var list = await _context.Auctions
                .Where(a => a.SellerId == userId)
                .OrderByDescending(a => a.EndsAt)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.CurrentHighestBid,
                    a.Status,
                    a.EndsAt
                })
                .ToListAsync();

            return Ok(list);
        }

        [HttpGet("participant")]
        public async Task<IActionResult> Participant()
        {
            var userId = CurrentUserId();

            var list = await _context.Bids
                .Where(b => b.BidderId == userId)
                .OrderByDescending(b => b.PlacedAt)
                .Select(b => new
                {
                    b.Id,
                    b.Amount,
                    b.PlacedAt,
                    AuctionTitle = b.Auction.Title,
                    AuctionId = b.AuctionId,
                    b.Auction.Status
                })
                .ToListAsync();

            return Ok(list);
        }
    }
}