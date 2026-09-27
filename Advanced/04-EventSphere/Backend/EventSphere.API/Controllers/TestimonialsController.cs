using EventSphere.Application.Interfaces;
using EventSphere.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestimonialsController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public TestimonialsController(IAppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] bool onlyPublished = true)
        {
            var query = _context.Testimonials.AsQueryable();
            if (onlyPublished)
                query = query.Where(t => t.IsPublished);

            var result = await query
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var t = await _context.Testimonials.FindAsync(id);
            return t is null ? NotFound() : Ok(t);
        }

        public class TestimonialInput
        {
            public string Name { get; set; } = string.Empty;
            public string Role { get; set; } = string.Empty;
            public string City { get; set; } = string.Empty;
            public string Message { get; set; } = string.Empty;
            public string Hieroglyph { get; set; } = "𓂀";
            public int Rating { get; set; } = 5;
            public bool IsPublished { get; set; } = true;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(TestimonialInput input)
        {
            var t = new Testimonial
            {
                Name = input.Name,
                Role = input.Role,
                City = input.City,
                Message = input.Message,
                Hieroglyph = input.Hieroglyph,
                Rating = Math.Clamp(input.Rating, 1, 5),
                IsPublished = input.IsPublished,
                CreatedAt = DateTime.UtcNow,
            };

            _context.Testimonials.Add(t);
            await _context.SaveChangesAsync();
            return Ok(t);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, TestimonialInput input)
        {
            var t = await _context.Testimonials.FindAsync(id);
            if (t is null) return NotFound();

            t.Name = input.Name;
            t.Role = input.Role;
            t.City = input.City;
            t.Message = input.Message;
            t.Hieroglyph = input.Hieroglyph;
            t.Rating = Math.Clamp(input.Rating, 1, 5);
            t.IsPublished = input.IsPublished;

            await _context.SaveChangesAsync();
            return Ok(t);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var t = await _context.Testimonials.FindAsync(id);
            if (t is null) return NotFound();

            _context.Testimonials.Remove(t);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}