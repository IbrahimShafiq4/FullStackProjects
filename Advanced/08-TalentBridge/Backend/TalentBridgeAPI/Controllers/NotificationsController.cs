using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TalentBridgeAPI.Data;
using TalentBridgeAPI.DTOs;

namespace TalentBridgeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public NotificationsController(AppDbContext context)
        { _context = context; }


        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var notifications = await _context.Notifications.Where(n => n.RecipientId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationDto(n.Id, n.Message, n.IsRead, n.CreatedAt))
                .ToListAsync();

            return Ok(notifications);
        }

        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification is null)
                return NotFound();

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
