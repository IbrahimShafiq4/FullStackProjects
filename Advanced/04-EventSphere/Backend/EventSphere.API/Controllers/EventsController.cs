using EventSphere.Application.Features;
using EventSphere.Application.Features.Events.Commands;
using EventSphere.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IAppDbContext _context;

        public EventsController(IMediator mediator, IAppDbContext context)
        {
            _mediator = mediator;
            _context = context;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetEvents() =>
            Ok(await _context.Events.Include(e => e.Venue)
                .Select(e => new EventDto(e.Id, e.Title, e.EventDate, e.BasePrice, e.Venue.Name))
                .ToListAsync());

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetEvent(int id)
        {
            var ev = await _context.Events.Include(e => e.Venue)
                .FirstOrDefaultAsync(e => e.Id == id);
            if (ev is null) return NotFound();

            return Ok(new
            {
                ev.Id,
                ev.Title,
                ev.EventDate,
                ev.BasePrice,
                ev.VenueId,
                VenueName = ev.Venue.Name,
                VenueAddress = ev.Venue.Address,
                ev.OrganizerId,
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Organizer")]
        public async Task<IActionResult> CreateEvent(CreateEventRequest req)
        {
            var id = await _mediator.Send(new CreateEventCommand(
                req.Title, req.EventDate, req.BasePrice, req.VenueId, GetCurrentUserId()));
            return Ok(new { id });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Organizer")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev is null) return NotFound();

            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin && ev.OrganizerId != GetCurrentUserId())
                return Forbid();

            _context.Events.Remove(ev);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}