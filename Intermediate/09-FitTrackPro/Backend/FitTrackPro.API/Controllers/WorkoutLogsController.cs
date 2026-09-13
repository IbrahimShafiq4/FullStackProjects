using Asp.Versioning;
using FitTrackPro.API.Data;
using FitTrackPro.API.DTOs;
using FitTrackPro.API.Features;
using FitTrackPro.API.Mediator;
using FitTrackPro.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FitTrackPro.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize(Roles = "Trainee")]
    public class WorkoutLogsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMediaStorageService _mediaStorage;
        private readonly AppDbContext _context;

        public WorkoutLogsController(
            IMediator mediator,
            IMediaStorageService mediaStorage,
            AppDbContext context)
        {
            _mediator = mediator;
            _mediaStorage = mediaStorage;
            _context = context;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        }

        [HttpPost("log")]
        [EnableRateLimiting("workout-logging")]
        [RequestSizeLimit(1L * 1024 * 1024 * 1024)]
        [RequestFormLimits(MultipartBodyLengthLimit = 1L * 1024 * 1024 * 1024)]

        public async Task<IActionResult> LogWorkout(
            [FromForm] LogWorkoutDto dto,
            IFormFile? voiceNote)
        {
            var result = await _mediator.SendAsync(
                new LogWorkoutCommand(
                    GetCurrentUserId(),
                    dto.ExerciseId,
                    dto.Reps,
                    dto.Weight
                )
            );

            if (!result)
                return BadRequest("فشل تسجيل التمرين");

            if (voiceNote is not null && voiceNote.Length > 0)
            {
                try
                {
                    await _mediaStorage.SaveAsync(voiceNote, MediaKind.Audio);
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            return Ok(new { message = "تم تسجيل التمرين بنجاح" });
        }

        [HttpGet("stats/me")]
        public async Task<IActionResult> GetMyStats()
        {
            var traineeId = GetCurrentUserId();

            var totalLogs = await _context.WorkoutLogs
                .CountAsync(wl => wl.TraineeId == traineeId);

            var totalWeight = await _context.WorkoutLogs
                .Where(wl => wl.TraineeId == traineeId)
                .SumAsync(wl => wl.Weight);

            var totalReps = await _context.WorkoutLogs
                .Where(wl => wl.TraineeId == traineeId)
                .SumAsync(wl => wl.Reps);

            var sessionsCount = await _context.WorkoutLogs
                .Where(wl => wl.TraineeId == traineeId)
                .Select(wl => wl.LoggedAt.Date)
                .Distinct()
                .CountAsync();

            var startDate = DateTime.UtcNow.Date.AddDays(-6);
            var weeklyLogs = await _context.WorkoutLogs
                .Where(wl => wl.TraineeId == traineeId && wl.LoggedAt >= startDate)
                .GroupBy(wl => wl.LoggedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    LogCount = g.Count(),
                    TotalWeight = g.Sum(x => x.Weight),
                    TotalReps = g.Sum(x => x.Reps)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            var weeklyData = Enumerable.Range(0, 7)
                .Select(offset => startDate.AddDays(offset))
                .Select(date => new
                {
                    Date = date,
                    LogCount = weeklyLogs.FirstOrDefault(x => x.Date == date)?.LogCount ?? 0,
                    TotalWeight = weeklyLogs.FirstOrDefault(x => x.Date == date)?.TotalWeight ?? 0,
                    TotalReps = weeklyLogs.FirstOrDefault(x => x.Date == date)?.TotalReps ?? 0
                })
                .ToList();

            return Ok(new
            {
                totalLogs,
                totalWeight,
                totalReps,
                sessionsCount,
                weeklyData
            });
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentLogs([FromQuery] int take = 10)
        {
            var traineeId = GetCurrentUserId();

            var logs = await _context.WorkoutLogs
                .Include(wl => wl.Exercise)
                    .ThenInclude(e => e.WorkoutPlan)
                .Where(wl => wl.TraineeId == traineeId)
                .OrderByDescending(wl => wl.LoggedAt)
                .Take(take)
                .Select(wl => new
                {
                    wl.Id,
                    wl.Reps,
                    wl.Weight,
                    wl.LoggedAt,
                    exerciseName = wl.Exercise.Name,
                    planName = wl.Exercise.WorkoutPlan.Title
                })
                .ToListAsync();

            return Ok(logs);
        }
    }
}