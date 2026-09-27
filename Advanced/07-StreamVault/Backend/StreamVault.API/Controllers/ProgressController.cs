using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamVault.Application.Features;
using StreamVault.Application.Interfaces;
using StreamVault.Domain.Domain;
using System.Security.Claims;

namespace StreamVault.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProgressController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public ProgressController(IAppDbContext context)
        {
            _context = context;
        }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();

        [HttpPost]
        public async Task<IActionResult> SaveProgress(
            WatchProgressDto dto,
            CancellationToken cancellationToken)
        {
            var userId = CurrentUserId;

            var existing = await _context.WatchProgresses
                .FirstOrDefaultAsync(
                    p => p.VideoId == dto.VideoId &&
                         p.ViewerId == userId,
                    cancellationToken);

            if (existing is not null)
            {
                existing.LastPositionSeconds = dto.LastPositionSeconds;
            }
            else
            {
                var progress = new WatchProgress
                {
                    VideoId = dto.VideoId,
                    ViewerId = userId,
                    LastPositionSeconds = dto.LastPositionSeconds
                };

                _context.WatchProgresses.Add(progress);
            }

            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new
            {
                message = "تم حفظ تقدم المشاهدة بنجاح"
            });
        }

        [HttpGet("video/{videoId:int}")]
        public async Task<IActionResult> GetProgress(
            int videoId,
            CancellationToken cancellationToken)
        {
            var progress = await _context.WatchProgresses
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    p => p.VideoId == videoId &&
                         p.ViewerId == CurrentUserId,
                    cancellationToken);

            return Ok(new
            {
                lastPositionSeconds = progress?.LastPositionSeconds ?? 0
            });
        }
    }
}