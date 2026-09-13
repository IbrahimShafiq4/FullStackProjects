using Asp.Versioning;
using FitTrackPro.API.Data;
using FitTrackPro.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitTrackPro.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/stats")]
    public class StatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("global")]
        [AllowAnonymous]
        public async Task<IActionResult> GetGlobalStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalCoaches = await _context.Users
                .CountAsync(u => u.Role == UserRole.Coach);
            var totalTrainees = await _context.Users
                .CountAsync(u => u.Role == UserRole.Trainee);
            var totalPlans = await _context.WorkoutPlans.CountAsync();
            var totalExercises = await _context.Exercises.CountAsync();
            var totalLogs = await _context.WorkoutLogs.CountAsync();
            var totalRatings = await _context.CoachRatings.CountAsync();

            return Ok(new
            {
                totalUsers,
                totalCoaches,
                totalTrainees,
                totalPlans,
                totalExercises,
                totalLogs,
                totalRatings
            });
        }
    }
}