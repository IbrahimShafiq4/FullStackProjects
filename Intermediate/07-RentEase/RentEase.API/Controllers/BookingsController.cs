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
        private readonly IBookingService _bookingService;
        public BookingsController(IBookingService bookingService) { _bookingService = bookingService; }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        // ─────────────────────────────────────────────────────────
        // READ — My bookings (as renter)
        // ─────────────────────────────────────────────────────────
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine() =>
            Ok(await _bookingService.GetMyBookingsAsync(GetUserId()));

        // ─────────────────────────────────────────────────────────
        // READ — Incoming bookings (as owner)
        // ─────────────────────────────────────────────────────────
        [HttpGet("incoming")]
        public async Task<IActionResult> GetIncoming() =>
            Ok(await _bookingService.GetIncomingBookingsAsync(GetUserId()));

        // ─────────────────────────────────────────────────────────
        // READ — One
        // ─────────────────────────────────────────────────────────
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dto = await _bookingService.GetBookingByIdAsync(id, GetUserId());
            return dto is null ? NotFound() : Ok(dto);
        }

        // ─────────────────────────────────────────────────────────
        // CREATE
        // ─────────────────────────────────────────────────────────
        [HttpPost("equipment/{equipmentId}")]
        public async Task<IActionResult> CreateBooking(int equipmentId, CreateBookingDto dto)
        {
            var (success, error, booking) = await _bookingService
                .CreateBookingAsync(equipmentId, GetUserId(), dto.StartDate, dto.EndDate);

            return success
                ? Ok(new { message = "تم إرسال طلب الحجز بنجاح", bookingId = booking!.Id })
                : BadRequest(error);
        }

        // ─────────────────────────────────────────────────────────
        // UPDATE — Owner confirms
        // ─────────────────────────────────────────────────────────
        [HttpPatch("{id}/confirm")]
        public async Task<IActionResult> Confirm(int id)
        {
            var (success, error) = await _bookingService.ConfirmBookingAsync(id, GetUserId());
            return success ? Ok(new { message = "تم تأكيد الحجز" }) : BadRequest(error);
        }

        // ─────────────────────────────────────────────────────────
        // UPDATE — Owner rejects
        // ─────────────────────────────────────────────────────────
        [HttpPatch("{id}/reject")]
        public async Task<IActionResult> Reject(int id, [FromBody] RejectBookingDto? dto)
        {
            var (success, error) = await _bookingService.RejectBookingAsync(id, GetUserId(), dto?.Reason);
            return success ? Ok(new { message = "تم رفض الحجز" }) : BadRequest(error);
        }

        // ─────────────────────────────────────────────────────────
        // UPDATE — Renter cancels
        // ─────────────────────────────────────────────────────────
        [HttpPatch("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            var (success, error) = await _bookingService.CancelBookingAsync(id, GetUserId());
            return success ? Ok(new { message = "تم إلغاء الحجز" }) : BadRequest(error);
        }

        // ─────────────────────────────────────────────────────────
        // DELETE — Only cancelled/rejected/completed
        // ─────────────────────────────────────────────────────────
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (success, error) = await _bookingService.DeleteBookingAsync(id, GetUserId());
            return success ? Ok(new { message = "تم حذف الحجز" }) : BadRequest(error);
        }
    }
}