using MedConnect.Application.Features;
using MedConnect.Application.Interfaces;
using MedConnect.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AvailabilityController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public AvailabilityController(IAppDbContext context)
        { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> AddSlot(CreateSlotDto dto)
        {
            var slot = new AvailabilitySlot { 
                DoctorId = GetCurrentUserId(), 
                DayOfWeek = dto.DayOfWeek, 
                StartTime = dto.StartTime, 
                EndTime = dto.EndTime 
            };

            _context.AvailabilitySlots.Add(slot);
            await _context.SaveChangesAsync();
            return Ok(new { slot.Id });
        }

        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetDoctorSlots(string doctorId) =>
            Ok(
                await _context.AvailabilitySlots
                    .Where(s => s.DoctorId == doctorId)
                    .Select(s => new { s.Id, s.DayOfWeek, s.StartTime, s.EndTime })
                    .ToListAsync()
            );
    }
}
