using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using R_FIT.Application.Interfaces;
using R_FIT.Domain.Entities;
using System.Security.Claims;

namespace R_FIT.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookmarksController : Controller
    {
        private readonly IAppDbContext _context;

        public BookmarksController(IAppDbContext context)
        { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetCurrentUserId();
            return Ok(await _context.Bookmarks.Include(b => b.Post).Where(b => b.UserId == userId)
                .Select(b => new { b.Id, b.PostId, b.Post.Content, b.SavedAt }).ToListAsync());
        }

        [HttpGet("bookmarkId:int")]
        public async Task<IActionResult> GetById(int bookmarkId)
        {
            var bookmark = await _context.Bookmarks.Include(b => b.Post).FirstOrDefaultAsync(b => b.Id == bookmarkId);
            return bookmark == null ? NotFound() : Ok(new { bookmark.Id, bookmark.PostId, bookmark.Post.Content, bookmark.SavedAt });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] int postId)
        {
            var userId = GetCurrentUserId();

            var alreadyExists = await _context.Bookmarks.AnyAsync(b => b.PostId == postId && b.UserId == userId);
            if (alreadyExists) return BadRequest("هذا البوست محفوظ بالفعل.");

            var bookmark = new Bookmark { PostId = postId, UserId = userId };
            _context.Bookmarks.Add(bookmark);
            await _context.SaveChangesAsync();
            return Ok(new { bookmark.Id });
        }

        [HttpPut("bookmarkId:int")]
        public async Task<IActionResult> Update(int bookmarkId)
        {
            var bookmark = await _context.Bookmarks.FindAsync(bookmarkId);
            if (bookmark is null) return NotFound();

            bookmark.SavedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("bookmarkId:int")]
        public async Task<IActionResult> Delete(int bookmarkId)
        {
            var bookmark = await _context.Bookmarks.FindAsync(bookmarkId);
            if (bookmark is null) return NotFound();

            _context.Bookmarks.Remove(bookmark);
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم حذف البوستات من المحفوظات." });
        }
    }
}
