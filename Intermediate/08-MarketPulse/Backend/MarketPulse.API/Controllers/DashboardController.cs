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

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("seller")]
        public async Task<IActionResult> GetSellerAuctions()
        {
            var userId = GetCurrentUserId();
            var auctions = await _context.Auctions
                .Where(a => a.SellerId == userId)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.CurrentHighestBid,
                    a.Status,
                    a.EndsAt
                })
                .OrderByDescending(a => a.EndsAt)
                .ToListAsync();
            return Ok(auctions);
        }

        [HttpGet("participant")]
        public async Task<IActionResult> GetParticipantBids()
        {
            var userId = GetCurrentUserId();
            var bids = await _context.Bids
                .Where(b => b.BidderId == userId)
                .Include(b => b.Auction)
                .Select(b => new
                {
                    b.Id,
                    b.Amount,
                    b.PlacedAt,
                    AuctionTitle = b.Auction.Title,
                    AuctionId = b.AuctionId,
                    b.Auction.Status
                })
                .OrderByDescending(b => b.PlacedAt)
                .ToListAsync();
            return Ok(bids);
        }
    }
}