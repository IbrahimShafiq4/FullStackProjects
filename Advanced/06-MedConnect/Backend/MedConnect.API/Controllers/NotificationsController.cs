using MedConnect.Application.Features;
using MedConnect.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public NotificationsController(IAppDbContext context)
        {
            _context = context;
        }

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] bool unreadOnly = false)
        {
            var query = _context.Notifications
                .AsNoTracking()
                .Where(n => n.UserId == UserId);

            if (unreadOnly) query = query.Where(n => !n.IsRead);

            var items = await query
                .OrderByDescending(n => n.CreatedAt)
                .Take(100)
                .Select(n => new NotificationDto(
                    n.Id,
                    n.Type.ToString(),
                    n.Title,
                    n.Body,
                    n.Link,
                    n.IsRead,
                    n.CreatedAt))
                .ToListAsync();

            return Ok(items);
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> UnreadCount()
        {
            var count = await _context.Notifications
                .CountAsync(n => n.UserId == UserId && !n.IsRead);
            return Ok(new { count });
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkRead(int id)
        {
            var n = await _context.Notifications
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == UserId);
            if (n is null) return NotFound();

            n.IsRead = true;
            n.ReadAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم التعليم كمقروء" });
        }

        [HttpPost("read-all")]
        public async Task<IActionResult> MarkAllRead()
        {
            var list = await _context.Notifications
                .Where(n => n.UserId == UserId && !n.IsRead)
                .ToListAsync();

            foreach (var n in list)
            {
                n.IsRead = true;
                n.ReadAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = $"تم تعليم {list.Count} إشعار كمقروء" });
        }
    }
}