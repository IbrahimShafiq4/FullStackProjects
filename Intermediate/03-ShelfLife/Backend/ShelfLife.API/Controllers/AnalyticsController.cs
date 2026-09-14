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
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AnalyticsController(AppDbContext context) { _context = context; }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("my-stats")]
        public async Task<IActionResult> GetMyStats()
        {
            var userId = GetCurrentUserId();
            var now = DateTime.UtcNow;

            var products = await _context.Products
                .Where(p => p.AppUserId == userId)
                .ToListAsync();

            var total = products.Count;
            var fresh = products.Count(p => (p.ExpiryDate.Date - now.Date).Days > 3);
            var expiring = products.Count(p => {
                var d = (p.ExpiryDate.Date - now.Date).Days;
                return d >= 0 && d <= 3;
            });
            var expired = products.Count(p => (p.ExpiryDate.Date - now.Date).Days < 0);

            var recipes = await _context.RecipeVideos.CountAsync(r => r.AppUserId == userId);

            var wasteRate = total > 0 ? Math.Round((double)expired / total * 100, 1) : 0;

            return Ok(new
            {
                totalProducts = total,
                fresh,
                expiringSoon = expiring,
                expired,
                totalRecipes = recipes,
                wasteRate,
                savedMoneyEstimate = expired * 25
            });
        }
    }
}
