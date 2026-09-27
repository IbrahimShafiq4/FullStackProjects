using EventSphere.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public NotificationsController(IAppDbContext context)
        { _context = context; }

        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpComing()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var upcoming = await _context.Bookings
                .Include(b => b.Seat).ThenInclude(s => s.Event)
                .Where(b => b.AttendeeId == userId && b.Seat.Event.EventDate > DateTime.UtcNow)
                .Select(b => new { b.Id, EventTitle = b.Seat.Event.Title, b.Seat.Event.EventDate })
                .ToListAsync();

            return Ok(upcoming);
        }
    }
}
