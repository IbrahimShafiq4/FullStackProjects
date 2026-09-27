using CraftCommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CraftCommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AnalyticsController(AppDbContext context)
        { _context = context; }

        [HttpGet("artisan-dashboard")]
        public async Task<IActionResult> GetArtisanDashboard()
        {
            var artisanId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var products = await _context.Products
                    .Where(p => p.ArtisanId == artisanId)
                    .ToListAsync();
            var productIds = products.Select(p => p.Id).ToList();

            var totalRevenue = await _context.OrderItems
                    .Where(i => productIds.Contains(i.ProductId))
                    .SumAsync(i => i.UnitPrice * i.Quantity);

            var totalSold = await _context.OrderItems
                    .Where(i => productIds.Contains(i.ProductId))
                    .SumAsync(i => i.Quantity);

            var avgRating = await _context.Reviews
                    .Where(r => productIds.Contains(r.ProductId))
                    .AverageAsync(r => (double?)r.Rating) ?? 0;

            return Ok(new { totalProducts = products.Count, totalRevenue, totalSold, avgRating });
        }
    }
}
