using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShelfLife.Domain.Entities;
using ShelfLife.Infrastructure.Data;
using System.Security.Claims;

namespace ShelfLife.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ShoppingItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ShoppingItemsController(AppDbContext context)
        {
            _context = context;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetMyShoppingList()
        {
            var userId = GetCurrentUserId();

            var items = await _context.ShoppingItems
                .Where(s => s.AppUserId == userId)
                .OrderBy(s => s.IsPurchased)
                .ThenByDescending(s => s.AddedAt)
                .Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Quantity,
                    s.IsPurchased,
                    s.AddedAt
                })
                .ToListAsync();

            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> AddItem([FromBody] CreateShoppingItemRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Name))
                return BadRequest("الاسم مطلوب");

            var userId = GetCurrentUserId();

            var item = new ShoppingItem
            {
                Name = req.Name.Trim(),
                Quantity = req.Quantity < 1 ? 1 : req.Quantity,
                AppUserId = userId
            };

            _context.ShoppingItems.Add(item);
            await _context.SaveChangesAsync();

            return Ok(new { id = item.Id, message = "تمت الإضافة" });
        }

        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> TogglePurchased(int id)
        {
            var userId = GetCurrentUserId();
            var item = await _context.ShoppingItems
                .FirstOrDefaultAsync(s => s.Id == id && s.AppUserId == userId);

            if (item is null) return NotFound();

            item.IsPurchased = !item.IsPurchased;
            await _context.SaveChangesAsync();

            return Ok(new { item.Id, item.IsPurchased });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var userId = GetCurrentUserId();
            var item = await _context.ShoppingItems
                .FirstOrDefaultAsync(s => s.Id == id && s.AppUserId == userId);

            if (item is null) return NotFound();

            _context.ShoppingItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم الحذف" });
        }

        [HttpPost("auto-generate")]
        public async Task<IActionResult> AutoGenerateFromExpired()
        {
            var userId = GetCurrentUserId();

            var expiredNames = await _context.Products
                .Where(p => p.AppUserId == userId && p.ExpiryDate < DateTime.UtcNow)
                .Select(p => p.Name)
                .Distinct()
                .ToListAsync();

            if (expiredNames.Count == 0)
                return Ok(new { message = "لا يوجد منتجات منتهية تحتاج شراء", added = 0 });

            var existingNames = await _context.ShoppingItems
                .Where(s => s.AppUserId == userId && !s.IsPurchased)
                .Select(s => s.Name)
                .ToListAsync();

            var newItems = expiredNames
                .Where(name => !existingNames.Contains(name))
                .Select(name => new ShoppingItem
                {
                    Name = name,
                    AppUserId = userId
                })
                .ToList();

            if (newItems.Count == 0)
                return Ok(new { message = "كل المنتجات المنتهية موجودة بالفعل في القائمة", added = 0 });

            _context.ShoppingItems.AddRange(newItems);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"تم إضافة {newItems.Count} عنصر", added = newItems.Count });
        }
    }

    public record CreateShoppingItemRequest(string Name, int Quantity = 1);
}