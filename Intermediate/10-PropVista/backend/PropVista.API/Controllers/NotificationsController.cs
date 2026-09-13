using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using PropVista.API.Data;
using PropVista.API.Hubs;
using System.Security.Claims;

namespace PropVista.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationsController(
            AppDbContext context,
            IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost("request-video-call/{viewingId}")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> RequestVideoCall(int viewingId)
        {
            var seekerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var callerName = User.FindFirstValue(ClaimTypes.Name) ?? "باحث";

            var viewing = await _context.Viewings.FindAsync(viewingId);

            if (viewing == null)
                return NotFound(new { message = "المعاينة غير موجودة" });

            if (viewing.SeekerId != seekerId)
                return Forbid();

            var property = await _context.Properties
                .FindAsync(viewing.PropertyId);

            if (property == null)
                return NotFound(new { message = "العقار غير موجود" });

            await _hubContext.Clients
                .Group($"user-{property.OwnerId}")
                .SendAsync(
                    "VideoCallRequested",
                    viewingId,
                    callerName);

            return Ok(new
            {
                message = "تم إرسال طلب المعاينة للمالك"
            });
        }
    }
}