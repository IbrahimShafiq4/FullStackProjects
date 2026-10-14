using MarketPulse.API.Data;
using MarketPulse.API.DTOs;
using MarketPulse.API.Hubs;
using MarketPulse.API.Models;
using MarketPulse.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
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
        private const long MaxFileSize = 15 * 1024 * 1024;
        private static readonly HashSet<string> AllowedExt =
            new(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".webp", ".mp4", ".webm", ".mov" };

        private readonly AppDbContext _context;
        private readonly IBidService _bids;
        private readonly ICachedAuctionService _cached;
        private readonly IHubContext<AuctionHub> _hub;
        private readonly IWebHostEnvironment _env;

        public AuctionsController(
            AppDbContext context,
            IBidService bids,
            ICachedAuctionService cached,
            IHubContext<AuctionHub> hub,
            IWebHostEnvironment env)
        {
            _context = context;
            _bids = bids;
            _cached = cached;
            _hub = hub;
            _env = env;
        }

        private string CurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetActive([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 50);

            var query = _context.Auctions
                .Where(a => a.Status == AuctionStatus.Active)
                .OrderBy(a => a.EndsAt);

            var total = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new AuctionDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    StartingPrice = a.StartingPrice,
                    CurrentHighestBid = a.CurrentHighestBid,
                    EndsAt = a.EndsAt,
                    Status = a.Status.ToString(),
                    SellerName = a.Seller.FullName,
                    CoverUrl = a.MediaUrls.FirstOrDefault(),
                    BidCount = a.Bids.Count
                })
                .ToListAsync();

            return Ok(new PagedResult<AuctionDto>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                Total = total
            });
        }

        [HttpGet("popular")]
        [AllowAnonymous]
        public async Task<IActionResult> Popular() =>
            Ok(await _cached.GetPopularAuctionsAsync());

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> Detail(int id)
        {
            var a = await _context.Auctions
                .Where(x => x.Id == id)
                .Select(x => new AuctionDetailDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    StartingPrice = x.StartingPrice,
                    CurrentHighestBid = x.CurrentHighestBid,
                    EndsAt = x.EndsAt,
                    Status = x.Status.ToString(),
                    SellerName = x.Seller.FullName,
                    SellerId = x.SellerId,
                    WinnerId = x.WinnerId,
                    WinnerName = x.Winner != null ? x.Winner.FullName : null,
                    MediaUrls = x.MediaUrls,
                    BidCount = x.Bids.Count
                })
                .FirstOrDefaultAsync();

            return a is null ? NotFound() : Ok(a);
        }

        [HttpGet("{id:int}/bids")]
        [AllowAnonymous]
        public async Task<IActionResult> Bids(int id, [FromQuery] int take = 50)
        {
            take = Math.Clamp(take, 1, 200);

            var list = await _context.Bids
                .Where(b => b.AuctionId == id)
                .OrderByDescending(b => b.PlacedAt)
                .Take(take)
                .Select(b => new BidDto
                {
                    Id = b.Id,
                    Amount = b.Amount,
                    PlacedAt = b.PlacedAt,
                    BidderId = b.BidderId,
                    BidderName = b.Bidder.FullName,
                    BidderAvatarUrl = b.Bidder.AvatarUrl
                })
                .ToListAsync();

            return Ok(list);
        }

        [HttpPost]
        [EnableRateLimiting("upload")]
        public async Task<IActionResult> Create([FromForm] CreateAuctionDto dto,
            IFormFileCollection? mediaFiles)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            if (dto.StartingPrice <= 0)
                return BadRequest(new { message = "السعر الابتدائي غير صحيح" });

            var auction = new Auction
            {
                Title = dto.Title.Trim(),
                StartingPrice = dto.StartingPrice,
                CurrentHighestBid = dto.StartingPrice,
                EndsAt = DateTime.UtcNow.AddMinutes(dto.DurationMinutes),
                SellerId = CurrentUserId()
            };

            if (mediaFiles is { Count: > 0 })
            {
                if (mediaFiles.Count > 6)
                    return BadRequest(new { message = "الحد الأقصى 6 ملفات" });

                var uploads = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
                Directory.CreateDirectory(uploads);

                foreach (var file in mediaFiles)
                {
                    if (file.Length == 0 || file.Length > MaxFileSize)
                        return BadRequest(new { message = "حجم الملف يجب أن يكون أقل من 15 ميجا" });

                    var ext = Path.GetExtension(file.FileName);
                    if (!AllowedExt.Contains(ext))
                        return BadRequest(new { message = "نوع الملف غير مسموح" });

                    var unique = $"{Guid.NewGuid():N}{ext}";
                    var path = Path.Combine(uploads, unique);
                    using var stream = new FileStream(path, FileMode.Create);
                    await file.CopyToAsync(stream);

                    auction.MediaUrls.Add($"/uploads/{unique}");
                }
            }

            _context.Auctions.Add(auction);
            await _context.SaveChangesAsync();

            return Ok(new { auction.Id });
        }

        [HttpPost("{id:int}/bid")]
        [EnableRateLimiting("bid")]
        public async Task<IActionResult> PlaceBid(int id, PlaceBidDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var userId = CurrentUserId();
            var (success, error, bid) = await _bids.PlaceBidAsync(id, userId, dto.Amount);
            if (!success) return BadRequest(new { message = error });

            var bidderName = User.FindFirstValue(ClaimTypes.Name) ?? "مزايد";
            var bidder = await _context.Users.FindAsync(userId);

            await _hub.Clients.Group($"auction-{id}").SendAsync("NewBid", new
            {
                Amount = dto.Amount,
                BidderName = bidderName,
                BidderAvatarUrl = bidder?.AvatarUrl,
                PlacedAt = DateTime.UtcNow
            });

            return Ok(new { message = "تم تسجيل مزايدتك بنجاح", bidId = bid!.Id });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> UserProfile(string userId)
        {
            var user = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new { u.Id, u.FullName, u.Email, u.AvatarUrl })
                .FirstOrDefaultAsync();

            return user is null ? NotFound() : Ok(user);
        }

        [HttpPost("user/avatar")]
        [EnableRateLimiting("upload")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            if (file is null || file.Length == 0)
                return BadRequest(new { message = "الملف مطلوب" });
            if (file.Length > 3 * 1024 * 1024)
                return BadRequest(new { message = "حجم الصورة يجب أن يكون أقل من 3 ميجا" });

            var ext = Path.GetExtension(file.FileName);
            if (!new[] { ".jpg", ".jpeg", ".png", ".webp" }.Contains(ext, StringComparer.OrdinalIgnoreCase))
                return BadRequest(new { message = "صيغة الصورة غير مسموحة" });

            var userId = CurrentUserId();
            var folder = Path.Combine(_env.WebRootPath ?? "wwwroot", "avatars");
            Directory.CreateDirectory(folder);

            var unique = $"{Guid.NewGuid():N}{ext}";
            var path = Path.Combine(folder, unique);
            using (var stream = new FileStream(path, FileMode.Create))
                await file.CopyToAsync(stream);

            var url = $"/avatars/{unique}";
            var user = await _context.Users.FindAsync(userId);
            if (user is null) return NotFound();

            user.AvatarUrl = url;
            await _context.SaveChangesAsync();

            return Ok(new { url });
        }
    }
}