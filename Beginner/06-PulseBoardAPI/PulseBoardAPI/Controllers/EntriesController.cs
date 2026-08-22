using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PulseBoardAPI.Data;
using PulseBoardAPI.DTOs.Entries;
using PulseBoardAPI.Models;
using System.Security.Claims;

namespace PulseBoardAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EntriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public EntriesController(AppDbContext context, IMapper mapper)
        { _context = context; _mapper = mapper; }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost]
        public async Task<ActionResult<EntryDto>> CreateEntry(CreateEntryDto dto)
        {
            var userId = GetCurrentUserId();
            var today = DateTime.UtcNow.Date;

            var alreadyLogged = await _context.PulseEntries.AnyAsync(e => e.AppUserId == userId && e.EntryDate == today);
            if (alreadyLogged)
            {
                return BadRequest("لقد سجلت نبضة اليوم بالفعل.");
            }

            if (dto.MoodLevel is < 1 or > 10 || dto.FocusLevel is < 1 or > 10) { return BadRequest("المستوى لازم يكون بين 1 و 10"); }

            var entry = new PulseEntry
            {
                MoodLevel = dto.MoodLevel,
                FocusLevel = dto.FocusLevel,
                Note = dto.Note,
                EntryDate = today,
                AppUserId = userId
            };

            _context.PulseEntries.Add(entry);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<EntryDto>(entry));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EntryDto>>> GetMyEntries()
        {
            var userId = GetCurrentUserId();

            var entries = await _context.PulseEntries
                                        .Where(e => e.AppUserId == userId)
                                        .OrderByDescending(e => e.EntryDate)
                                        .Take(30)
                                        .ToListAsync();

            return Ok(_mapper.Map<List<EntryDto>>(entries));
        }

        [HttpGet("chart-data")]
        public async Task<ActionResult> GetChartData()
        {
            var userId = GetCurrentUserId();

            var entries = await _context.PulseEntries
                                        .Where(e => e.AppUserId == userId)
                                        .OrderBy(e => e.EntryDate)
                                        .Take(14)
                                        .ToListAsync();

            var result = new
            {
                labels = entries.Select(e => e.EntryDate.ToString("dd/MM")),
                MoodData = entries.Select(e => e.MoodLevel),
                focusData = entries.Select(e => e.FocusLevel)
            };

            return Ok(result);
        }
    }
}
