using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShelfLife.Infrastructure.Data;
using System.Security.Claims;

namespace ShelfLife.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RemindersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public RemindersController(AppDbContext context) { _context = context; }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("expiring-soon")]
        public async Task<IActionResult> GetExpiringSoon()
        {
            var userId = GetCurrentUserId();
            var now = DateTime.UtcNow.Date;
            var threshold = now.AddDays(3);

            var items = await _context.Products
                .Where(p => p.AppUserId == userId
                         && p.ExpiryDate.Date >= now
                         && p.ExpiryDate.Date <= threshold)
                .OrderBy(p => p.ExpiryDate)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Quantity,
                    p.ExpiryDate,
                    daysLeft = (p.ExpiryDate.Date - now).Days,
                    p.PhotoUrl
                })
                .ToListAsync();

            return Ok(items);
        }
    }
}
