using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamVault.Application.Features;
using StreamVault.Application.Interfaces;
using StreamVault.Domain.Entities;
using System.Security.Claims;

namespace StreamVault.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LiveSessionsController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public LiveSessionsController(IAppDbContext context)
        {
            _context = context;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();

        [HttpPost]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> CreateSession(CreateLiveSessionDto dto)
        {
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == dto.CourseId && c.InstructorId == GetCurrentUserId());

            if (course is null)
                return NotFound(new { message = "الكورس غير موجود أو لا تملكه" });

            var session = new LiveSession
            {
                CourseId = dto.CourseId,
                Title = dto.Title,
                InstructorId = GetCurrentUserId(),
                Status = LiveSessionStatus.Live,
                StartedAt = DateTime.UtcNow
            };

            _context.LiveSessions.Add(session);
            await _context.SaveChangesAsync();

            return Ok(new { session.Id, session.CourseId });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetSession(int id)
        {
            var session = await _context.LiveSessions
                .AsNoTracking()
                .Where(s => s.Id == id)
                .Select(s => new
                {
                    s.Id,
                    s.Title,
                    s.CourseId,
                    s.InstructorId,
                    Status = s.Status.ToString(),
                    s.StartedAt,
                    s.EndedAt
                })
                .FirstOrDefaultAsync();

            if (session is null)
                return NotFound(new { message = "الجلسة غير موجودة" });

            return Ok(session);
        }

        [HttpPatch("{id:int}/end")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> EndSession(int id)
        {
            var session = await _context.LiveSessions
                .FirstOrDefaultAsync(s => s.Id == id && s.InstructorId == GetCurrentUserId());

            if (session is null)
                return NotFound(new { message = "الجلسة غير موجودة" });

            session.Status = LiveSessionStatus.Ended;
            session.EndedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم إنهاء الجلسة" });
        }

        [HttpGet("course/{courseId:int}")]
        public async Task<IActionResult> GetCourseSessions(int courseId) =>
            Ok(await _context.LiveSessions
                .Where(s => s.CourseId == courseId)
                .OrderByDescending(s => s.StartedAt)
                .Select(s => new LiveSessionDto(s.Id, s.Title, s.Status.ToString(), s.StartedAt))
                .ToListAsync());
    }
}