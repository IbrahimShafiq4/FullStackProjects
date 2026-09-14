using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShelfLife.Application.DTOs;
using ShelfLife.Domain.Entities;
using ShelfLife.Infrastructure.Data;
using System.Security.Claims;

namespace ShelfLife.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestimonialsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public TestimonialsController(AppDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        private async Task<bool> IsCurrentUserAdminAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return false;

            var user = await _userManager.FindByIdAsync(userId);
            return user?.IsAdmin ?? false;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetApproved()
        {
            var testimonials = await _context.Testimonials
                .Where(t => t.IsApproved)
                .OrderByDescending(t => t.CreatedAt)
                .Take(6)
                .Select(t => new TestimonialDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Role = t.Role,
                    City = t.City,
                    Quote = t.Quote,
                    Initials = t.Initials,
                    Rating = t.Rating,
                    IsApproved = t.IsApproved,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            return Ok(testimonials);
        }

        [HttpGet("pending")]
        [Authorize]
        public async Task<IActionResult> GetPending()
        {
            if (!await IsCurrentUserAdminAsync()) return Forbid();

            var testimonials = await _context.Testimonials
                .Where(t => !t.IsApproved)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TestimonialDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Role = t.Role,
                    City = t.City,
                    Quote = t.Quote,
                    Initials = t.Initials,
                    Rating = t.Rating,
                    IsApproved = t.IsApproved,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            return Ok(testimonials);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateTestimonialDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Role) ||
                string.IsNullOrWhiteSpace(dto.City) ||
                string.IsNullOrWhiteSpace(dto.Quote))
                return BadRequest("كل الحقول مطلوبة");

            if (dto.Quote.Length < 20)
                return BadRequest("الرأي لازم يكون 20 حرف على الأقل");

            if (dto.Rating < 1 || dto.Rating > 5)
                return BadRequest("التقييم من 1 لـ 5");

            var initials = dto.Name.Trim().Substring(0, 1);

            var testimonial = new Testimonial
            {
                Name = dto.Name.Trim(),
                Role = dto.Role.Trim(),
                City = dto.City.Trim(),
                Quote = dto.Quote.Trim(),
                Initials = initials,
                Rating = dto.Rating,
                IsApproved = false,
                CreatedAt = DateTime.UtcNow,
                AppUserId = GetCurrentUserId()
            };

            _context.Testimonials.Add(testimonial);
            await _context.SaveChangesAsync();

            return Ok(new { id = testimonial.Id, message = "تم إرسال رأيك — في انتظار الموافقة" });
        }

        [HttpPatch("{id}/approve")]
        [Authorize]
        public async Task<IActionResult> Approve(int id)
        {
            if (!await IsCurrentUserAdminAsync()) return Forbid();

            var testimonial = await _context.Testimonials.FindAsync(id);
            if (testimonial is null) return NotFound();

            testimonial.IsApproved = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم الموافقة على الرأي" });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            if (!await IsCurrentUserAdminAsync()) return Forbid();

            var testimonial = await _context.Testimonials.FindAsync(id);
            if (testimonial is null) return NotFound();

            _context.Testimonials.Remove(testimonial);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم الحذف" });
        }

        [HttpGet("mine")]
        [Authorize]
        public async Task<IActionResult> GetMine()
        {
            var userId = GetCurrentUserId();

            var testimonials = await _context.Testimonials
                .Where(t => t.AppUserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TestimonialDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Role = t.Role,
                    City = t.City,
                    Quote = t.Quote,
                    Initials = t.Initials,
                    Rating = t.Rating,
                    IsApproved = t.IsApproved,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            return Ok(testimonials);
        }
    }
}