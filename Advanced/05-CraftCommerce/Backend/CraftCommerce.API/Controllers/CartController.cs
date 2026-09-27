using CraftCommerce.Application.Features;
using CraftCommerce.Domain.Entities;
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
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CartController(AppDbContext context)
        { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var items = await _context.CartItems
                .Where(c => c.BuyerId == GetCurrentUserId())
                .Include(c => c.Product)
                .Select(c => new CartItemDto(
                    c.Id,
                    c.ProductId,
                    c.Product.Name,
                    c.Product.Price,
                    c.Quantity,
                    c.Product.Price * c.Quantity
                ))
                .ToListAsync();
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart(AddToCartDto dto)
        {
            var existing = await _context.CartItems
                                .FirstOrDefaultAsync(
                                    ci => ci.ProductId == dto.ProductId &&
                                    ci.BuyerId == GetCurrentUserId()
                                );

            if (existing is not null) existing.Quantity += dto.Quantity;
            else
                _context.CartItems.Add(new CartItem
                {
                    ProductId = dto.ProductId,
                    BuyerId = GetCurrentUserId(),
                    Quantity = dto.Quantity
                });

            await _context.SaveChangesAsync();
            return Ok(new { message = "تمت الإضافة للعربة" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var item = await _context.CartItems.FindAsync(id);
            if (item is null) return NotFound();

            if (item.BuyerId != GetCurrentUserId()) return Forbid();

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return NotFound();
        }
    }
}
