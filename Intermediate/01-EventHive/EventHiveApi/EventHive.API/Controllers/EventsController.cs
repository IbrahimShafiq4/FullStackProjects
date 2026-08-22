using EventHive.Application.DTOs.Events;
using EventHive.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventHive.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EventsController : ControllerBase
    {
        private readonly EventService _eventService;

        public EventsController(EventService eventService)
        {
            _eventService = eventService;
        }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        // ===== GET: api/events =====
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetAll([FromQuery] bool upcoming = false)
        {
            if (upcoming)
                return Ok(await _eventService.GetUpcomingEventsAsync());

            return Ok(await _eventService.GetAllEventsAsync());
        }

        // ===== GET: api/events/5 =====
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<EventDto>> GetById(int id)
        {
            var eventDto = await _eventService.GetEventByIdAsync(id);
            if (eventDto == null)
                return NotFound();
            return Ok(eventDto);
        }

        // ===== POST: api/events =====
        [HttpPost]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<ActionResult<EventDto>> Create(CreateEventDto dto)
        {
            var userId = GetUserId();
            var eventDto = await _eventService.CreateEventAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = eventDto.Id }, eventDto);
        }

        // ===== PUT: api/events/5 =====
        [HttpPut("{id}")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> Update(int id, UpdateEventDto dto)
        {
            var userId = GetUserId();
            var updated = await _eventService.UpdateEventAsync(id, dto, userId);
            if (updated == null)
                return Forbid();

            return Ok(updated);
        }

        // ===== DELETE: api/events/5 =====
        [HttpDelete("{id}")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var deleted = await _eventService.DeleteEventAsync(id, userId);
            if (!deleted)
                return NotFound();

            return Ok(new { message = $"تم الحذف بنجاح" });
        }

        // ===== POST: api/events/5/rsvp =====
        [HttpPost("{id}/rsvp")]
        [Authorize(Policy = "Attendee")]
        public async Task<IActionResult> Rsvp(int id)
        {
            var userId = GetUserId();
            var success = await _eventService.RsvpToEventAsync(id, userId);
            if (!success)
                return BadRequest("الحجز فشل (مفيش أماكن أو مسجل قبل كدا)");

            return Ok(new { message = "تم الحجز بنجاح ✅" });
        }

        // ===== DELETE: api/events/5/rsvp =====
        [HttpDelete("{id}/rsvp")]
        [Authorize(Policy = "Attendee")]
        public async Task<IActionResult> CancelRsvp(int id)
        {
            var userId = GetUserId();
            var success = await _eventService.CancelRsvp(id, userId);
            if (!success)
                return BadRequest("الحجز مش موجود");

            return NoContent();
        }

        [HttpGet("organizer")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetMyEvents()
        {
            var userId = GetUserId();
            var events = await _eventService.GetEventsByOrganizerAsync(userId);
            return Ok(events);
        }
    }
}
