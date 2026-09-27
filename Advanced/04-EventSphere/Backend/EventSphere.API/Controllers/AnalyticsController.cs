using EventSphere.Application.Interfaces;
using EventSphere.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public AnalyticsController(IAppDbContext context)
        { _context = context; }

        [HttpGet("event/{eventId}")]
        public async Task<IActionResult> GetEventAnalytics(int eventId)
        {
            var totalSeats  = await _context.Seats.CountAsync(s => s.EventId == eventId);
            var bookedSeats = await _context.Seats.CountAsync(s => s.EventId == eventId && s.Status == SeatStatus.Booked);

            var revenue = await _context.Bookings
                .Where(b => b.Seat.EventId == eventId && b.Status == BookingStatus.Confirmed)
                .SumAsync(b => b.FinalPrice);

            return Ok(new { totalSeats, bookedSeats, occupancyRate = totalSeats > 0 ? (double)bookedSeats / totalSeats * 100 : 0, revenue });
        }
    }
}
