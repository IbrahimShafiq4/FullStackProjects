using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EventSphere.Application.Features.Bookings.Commands;
using EventSphere.Application.Interfaces;
using EventSphere.Domain.Enums;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IAppDbContext _context;

        public BookingsController(IMediator mediator, IAppDbContext context)
        {
            _mediator = mediator;
            _context = context;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost("confirm/{seatId}")]
        public async Task<IActionResult> Confirm(int seatId)
        {
            var (success, error, bookingId) = await _mediator.Send(
                new ConfirmBookingCommand(seatId, GetCurrentUserId()));
            return success ? Ok(new { bookingId }) : BadRequest(error);
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userId = GetCurrentUserId();

            var bookings = await _context.Bookings
                .Include(b => b.Seat).ThenInclude(s => s.Event).ThenInclude(e => e.Venue)
                .Where(b => b.AttendeeId == userId && b.Status == BookingStatus.Confirmed)
                .OrderByDescending(b => b.BookedAt)
                .Select(b => new
                {
                    b.Id,
                    b.FinalPrice,
                    b.BookedAt,
                    EventId = b.Seat.Event.Id,
                    EventTitle = b.Seat.Event.Title,
                    EventDate = b.Seat.Event.EventDate,
                    VenueName = b.Seat.Event.Venue.Name,
                    SeatRow = b.Seat.Row,
                    SeatNumber = b.Seat.Number,
                })
                .ToListAsync();

            return Ok(bookings);
        }
    }
}