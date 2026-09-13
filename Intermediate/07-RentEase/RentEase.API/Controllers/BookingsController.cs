using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentEase.API.DTOs;
using RentEase.API.Services;
using System.Security.Claims;

namespace RentEase.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private IBookingService _bookingService;
        public BookingsController(IBookingService bookingService)
        { _bookingService = bookingService; }

        [HttpPost("equipment/{equipmentId}")]
        public async Task<IActionResult> CreateBooking(int equipmentId, CreateBookingDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var (success, error) = await _bookingService.CreateBookingAsync(equipmentId, userId, dto.StartDate, dto.EndDate);
            return success ? Ok(new { message = "تم إرسال طلب الحجز بنجاح" }) : BadRequest(error);
        }
    }
}
