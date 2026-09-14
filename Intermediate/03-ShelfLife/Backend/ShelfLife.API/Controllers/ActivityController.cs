using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShelfLife.Domain.Entities;
using ShelfLife.Infrastructure.Data;

namespace ShelfLife.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class ActivityController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActivityController(AppDbContext context)
        { _context = context; }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecent([FromQuery] int take = 12)
        {
            if (take < 1) take = 12;
            if (take > 30) take = 30;

            var items = await _context.ActivityItems
                .OrderByDescending(a => a.CreatedAt)
                .Take(take)
                .Select(a => new
                {
                    a.Id,
                    a.UserName,
                    a.UserInitial,
                    a.Action,
                    a.City,
                    a.CreatedAt,
                    timeAgo = FormatTimeAgo(a.CreatedAt)
                })
                .ToListAsync();

            return Ok(items);
        }

        private static string FormatTimeAgo(DateTime createdAt)
        {
            var diff = DateTime.UtcNow - createdAt;

            if (diff.TotalMinutes < 1) return "منذ لحظات";
            if (diff.TotalMinutes < 60) return $"منذ {(int)diff.TotalMinutes} دقيقة";
            if (diff.TotalHours < 24) return $"منذ {(int)diff.TotalHours} ساعة";
            if (diff.TotalDays < 7) return $"منذ {(int)diff.TotalDays} يوم";
            return $"منذ {(int)(diff.TotalDays / 7)} أسبوع";
        }
    }
}