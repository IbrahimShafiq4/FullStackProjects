using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PropVista.API.DTOs;
using PropVista.API.Services;
using System.Security.Claims;

namespace PropVista.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ViewingsController : ControllerBase
    {
        private readonly IViewingService _viewingService;

        public ViewingsController(IViewingService viewingService)
        {
            _viewingService = viewingService;
        }

        [HttpPost("property/{propertyId}")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> ScheduleViewing(
            int propertyId,
            ScheduleViewingDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var (success, error, viewingId) =
                await _viewingService.ScheduleViewingAsync(
                    propertyId,
                    userId,
                    dto.ScheduledAt);

            if (!success)
                return BadRequest(error);

            return Ok(new
            {
                message = "تم حجز موعد المعاينة بنجاح",
                viewingId
            });
        }
    }
}