using LedgerFlow.API.Data;
using LedgerFlow.API.DTOs;
using LedgerFlow.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LedgerFlow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CategoriesController(AppDbContext context) => _context = context;

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Where(c => c.OwnerId == GetCurrentUserId())
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Type = c.Type.ToString()
                })
                .ToListAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _context.Categories
                .Where(c => c.Id == id && c.OwnerId == GetCurrentUserId())
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Type = c.Type.ToString()
                })
                .FirstOrDefaultAsync();
            if (category == null) return NotFound();
            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory(CreateCategoryDto dto)
        {
            if (!Enum.TryParse<CategoryType>(dto.Type, true, out var type)) return BadRequest("نوع الفئة غير صحيح.");
            var category = new Category
            {
                Name = dto.Name,
                OwnerId = GetCurrentUserId(),
                Type = type
            };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok(new { category.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto dto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();
            if (category.OwnerId != GetCurrentUserId()) return Forbid();

            if (!string.IsNullOrWhiteSpace(dto.Name))
                category.Name = dto.Name;
            if (!string.IsNullOrWhiteSpace(dto.Type) && Enum.TryParse<CategoryType>(dto.Type, true, out var type))
                category.Type = type;

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم التحديث بنجاح" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();
            if (category.OwnerId != GetCurrentUserId()) return Forbid();
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم الحذف بنجاح" });
        }
    }
}