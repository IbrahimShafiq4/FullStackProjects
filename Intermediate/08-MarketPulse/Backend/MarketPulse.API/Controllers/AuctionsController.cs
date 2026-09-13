using MarketPulse.API.Data;
using MarketPulse.API.DTOs;
using MarketPulse.API.Hubs;
using MarketPulse.API.Models;
using MarketPulse.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MarketPulse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AuctionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IBidService _bidService;
        private readonly ICachedAuctionService _cachedService;
        private readonly IHubContext<AuctionHub> _hubContext;
        private readonly IWebHostEnvironment _env;

        public AuctionsController(
            AppDbContext context,
            IBidService bidService,
            ICachedAuctionService cachedService,
            IHubContext<AuctionHub> hubContext,
            IWebHostEnvironment env)
        {
            _context = context;
            _bidService = bidService;
            _cachedService = cachedService;
            _hubContext = hubContext;
            _env = env;
        }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetActiveAuctions()
        {
            var auctions = await _context.Auctions
                .Include(a => a.Seller)
                .Where(a => a.Status == AuctionStatus.Active)
                .Select(a => new AuctionDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    StartingPrice = a.StartingPrice,
                    CurrentHighestBid = a.CurrentHighestBid,
                    EndsAt = a.EndsAt,
                    Status = a.Status.ToString(),
                    SellerName = a.Seller.FullName,
                })
                .ToListAsync();
            return Ok(auctions);
        }

        [HttpGet("popular")]
        public async Task<IActionResult> GetPopular() => Ok(await _cachedService.GetPopularAuctionsAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuction(int id)
        {
            var auction = await _context.Auctions
                .Include(a => a.Seller)
                .Include(a => a.Winner)
                .Where(a => a.Id == id)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.StartingPrice,
                    a.CurrentHighestBid,
                    a.EndsAt,
                    a.Status,
                    SellerName = a.Seller.FullName,
                    WinnerName = a.Winner != null ? a.Winner.FullName : null,
                    a.MediaUrls,
                    a.SellerId
                })
                .FirstOrDefaultAsync();

            if (auction is null) return NotFound();
            return Ok(auction);
        }

        [HttpGet("{id}/bids")]
        public async Task<IActionResult> GetBidHistory(int id)
        {
            var bids = await _context.Bids
                .Where(b => b.AuctionId == id)
                .Include(b => b.Bidder)
                .OrderByDescending(b => b.PlacedAt)
                .Select(b => new
                {
                    b.Id,
                    b.Amount,
                    b.PlacedAt,
                    BidderName = b.Bidder.FullName,
                    BidderAvatarUrl = b.Bidder.AvatarUrl,
                    b.BidderId
                })
                .ToListAsync();
            return Ok(bids);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAuction([FromForm] CreateAuctionDto dto, IFormFileCollection? mediaFiles)
        {
            var auction = new Auction
            {
                Title = dto.Title,
                StartingPrice = dto.StartingPrice,
                CurrentHighestBid = dto.StartingPrice,
                EndsAt = DateTime.UtcNow.AddMinutes(dto.DurationMinutes),
                SellerId = GetCurrentUserId()
            };

            if (mediaFiles != null && mediaFiles.Any())
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                foreach (var file in mediaFiles)
                {
                    var uniqueName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(uploadsFolder, uniqueName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    auction.MediaUrls.Add($"/uploads/{uniqueName}");
                }
            }

            _context.Auctions.Add(auction);
            await _context.SaveChangesAsync();
            return Ok(new { auction.Id });
        }

        [HttpPost("{id}/bid")]
        public async Task<IActionResult> PlaceBid(int id, PlaceBidDto dto)
        {
            var (success, error, bid) = await _bidService.PlaceBidAsync(id, GetCurrentUserId(), dto.Amount);
            if (!success) return BadRequest(error);

            var bidderName = User.FindFirstValue(ClaimTypes.Name);
            await _hubContext.Clients
                .Group($"auction-{id}")
                .SendAsync("NewBid", new
                {
                    Amount = dto.Amount,
                    BidderName = bidderName,
                    PlacedAt = DateTime.UtcNow
                });

            return Ok(new { message = "تم تسجيل مزايدتك بنجاح" });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserProfile(string userId)
        {
            var user = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.AvatarUrl
                })
                .FirstOrDefaultAsync();
            if (user is null) return NotFound();
            return Ok(user);
        }

        [HttpPost("user/avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            var userId = GetCurrentUserId();
            var uploadsFolder = Path.Combine(_env.WebRootPath, "avatars");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var uniqueName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            var avatarUrl = $"/avatars/{uniqueName}";

            var user = await _context.Users.FindAsync(userId);
            user.AvatarUrl = avatarUrl;
            await _context.SaveChangesAsync();

            return Ok(new { url = avatarUrl });
        }
    }
}