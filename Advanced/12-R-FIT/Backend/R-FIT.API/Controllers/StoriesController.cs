using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using R_FIT.Application.Interfaces;
using R_FIT.Domain.Entities;
using System.Security.Claims;

namespace R_FIT.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StoriesController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly IWebHostEnvironment _env;
        public StoriesController(IAppDbContext context, IWebHostEnvironment env)
        { _context = context; _env = env; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetActive()
        {
            var stories = await _context.Stories
                .Include(s => s.Author)
                .Include(s => s.Views)
                .Where(s => s.ExpiredAt > DateTime.UtcNow)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

            return Ok(stories.Select(s => new
            {
                s.Id,
                s.MediaUrl,
                AuthorName = s.Author.FullName,
                s.Author.AvatarUrl,
                s.CreatedAt,
                s.ExpiredAt,
                ViewsCount = s.Views.Count
            }));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var story = await _context.Stories
                .Include(s => s.Author)
                .Include(s => s.Views)
                .FirstOrDefaultAsync(s => s.Id == id);

            return story == null ? NotFound() :
                Ok(new
                {
                    story.Id,
                    story.MediaUrl,
                    AuthorName = story.Author.FullName,
                    story.Author.AvatarUrl,
                    story.CreatedAt,
                    story.ExpiredAt,
                    ViewsCount = story.Views.Count
                });
        }

        [HttpPost]
        public async Task<IActionResult> Create(IFormFile media)
        {
            var extension = Path.GetExtension(media.FileName).ToLowerInvariant();
            if (!new[] { ".jpg", ".jpeg", ".png", ".mp4" }.Contains(extension)) 
                return BadRequest("نوع المحتوى غير مدعوم");

            var fileName = $"{Guid.NewGuid}{extension}";
            var folder = Path.Combine(_env.WebRootPath, "uploads", "stories");
            
            if (Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            using (var stream = new FileStream(Path.Combine(folder, fileName), FileMode.Create))
                await media.CopyToAsync(stream);

            var story = new Story
            {
                MediaUrl = $"/uploads/stories/{fileName}",
                AuthorId = GetCurrentUserId()
            };

            _context.Stories.Add(story);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                story.Id,
                story.ExpiredAt
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] int extraHours)
        {
            var story = await _context.Stories.FindAsync(id);
            if (story is null) return NotFound();

            if (story.AuthorId != GetCurrentUserId())
                return Forbid();

            story.ExpiredAt = story.ExpiredAt.AddHours(extraHours);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var story = await _context.Stories.FindAsync(id);
            if (story is null) return NotFound();
            if (story.AuthorId != GetCurrentUserId()) return Forbid();

            _context.Stories.Remove(story);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/view")]
        public async Task<IActionResult> RecordView(int id)
        {
            var userId = GetCurrentUserId();

            var alreadyViewed = await _context.StoryViews
                .AnyAsync(sv => sv.StoryId == id && sv.ViewerId == userId);

            if (!alreadyViewed)
            {
                _context.StoryViews.Add(new StoryView
                {
                    StoryId = id,
                    ViewerId = userId,
                    ViewedAt = DateTime.UtcNow
                });
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpGet("{id}/viewers")]
        public async Task<IActionResult> GetViewers(int id) =>
            Ok(await _context.StoryViews
                .Where(sv => sv.StoryId == id)
                .Select(sv => new { sv.ViewerId, sv.ViewedAt })
                .ToListAsync()
            );
    }
}
