using EventSphere.Application.Features;
using EventSphere.Application.Interfaces;
using EventSphere.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VenuesController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public VenuesController(IAppDbContext context) { _context = context; }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetVenues() =>
            Ok(await _context.Venues
                .Select(v => new VenueDto(v.Id, v.Name, v.Address, v.TotalRows, v.SeatsPerRow))
                .ToListAsync());

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetVenue(int id)
        {
            var v = await _context.Venues.FindAsync(id);
            return v is null ? NotFound() : Ok(new VenueDto(v.Id, v.Name, v.Address, v.TotalRows, v.SeatsPerRow));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateVenue(CreateVenueRequest req)
        {
            var venue = new Venue
            {
                Name = req.Name,
                Address = req.Address,
                TotalRows = req.TotalRows,
                SeatsPerRow = req.SeatsPerRow,
            };

            await _context.Venues.AddAsync(venue);
            await _context.SaveChangesAsync();
            return Ok(new { venue.Id });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteVenue(int id)
        {
            var v = await _context.Venues.FindAsync(id);
            if (v is null) return NotFound();

            _context.Venues.Remove(v);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}