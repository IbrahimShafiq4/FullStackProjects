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
    public class ArtisansController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ArtisansController(AppDbContext context)
        { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("my-products")]
        public async Task<IActionResult> GetMyProducts()
        {

            var products = await _context.Products
                .Where(p => p.ArtisanId == GetCurrentUserId())
                .Select(p => new { p.Id, p.Name, p.Price, p.StockQuantity }).ToListAsync();

            return Ok(products);
        }

        [HttpGet("my-products/{productId}")]
        public async Task<IActionResult> GetProductDetails(int productId)
        {
            var product = await _context.Products
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ArtisanId
                })
                .FirstOrDefaultAsync(p =>
                    p.ArtisanId == GetCurrentUserId() &&
                    p.Id == productId);

            if (product is null)
                return NotFound("المنتج غير موجود");

            return Ok(product);
        }
    }
}
