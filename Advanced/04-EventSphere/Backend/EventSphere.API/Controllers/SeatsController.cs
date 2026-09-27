using EventSphere.Application.Features.Events.Queries;
using EventSphere.Application.Interfaces;
using EventSphere.Infrastructure.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SeatsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ISeatLockingService _lockingService;

        public SeatsController(IMediator mediator, ISeatLockingService lockingService)
        {
            _mediator = mediator;
            _lockingService = lockingService;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("event/{eventId}")]
        public async Task<IActionResult> GetSeats(int eventId) =>
            Ok(await _mediator.Send(new GetEventSeatsQuery(eventId)));

        [HttpPost("{seatId}/lock")]
        public async Task<IActionResult> LockSeat(int seatId)
        {
            var userId = GetCurrentUserId();
            var (success, error) = await _lockingService.LockSeatAsync(seatId, userId);
            return success ? Ok(new { message = "تم حجز المقعد مؤقتاً" })
                           : BadRequest(new { message = error });
        }
    }
}