using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using R_FIT.Application.Interfaces;
using R_FIT.Domain.Entities;
using System.Security.Claims;

namespace R_FIT.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SharesController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public SharesController(IAppDbContext context)
        { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("post/{postId:int}")]
        public async Task<IActionResult> GetByPost(int postId) =>
            Ok(await _context.Shares
                .Where(s => s.OriginalPostId == postId)
                .Select(s => new 
                { 
                    s.Id, 
                    s.SharedById, 
                    s.AdditionalComment, 
                    s.ScheduledAt, 
                    s.CreatedAt 
                })
                .ToListAsync()
            );

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var share = await _context.Shares.FindAsync(id);
            return share == null ? NotFound() : Ok(
                    new 
                    {  
                        share.Id,
                        share.SharedById,
                        share.AdditionalComment,
                        share.ScheduledAt,
                        share.CreatedAt,
                    }
                );
        }

        [HttpGet("my/scheduled")]
        public async Task<IActionResult> GetMyScheduled()
        {
            var userId = GetCurrentUserId();
            var scheduled = await _context.Shares
                    .Where(s =>
                        s.SharedById == userId &&
                        s.ScheduledAt != null &&
                        s.ScheduledAt > DateTime.UtcNow
                    ).Select(s => new
                    {
                        s.Id,
                        s.OriginalPostId,
                        s.ScheduledAt
                    }).ToListAsync();

            return Ok(scheduled);
        }

        [HttpPost("post/{postId:int}")]
        public async Task<IActionResult> Create(int postId, [FromForm] string? additionalComment, [FromForm] string? scheduledAt)
        {
            var originalPost = await _context.Posts.FindAsync(postId);
            if (originalPost is null) return NotFound();

            DateTime? scheduledDate = null;
            if (!string.IsNullOrWhiteSpace(scheduledAt))
            {
                if (!DateTime.TryParse(scheduledAt, out var parsed)) return BadRequest("تاريخ الجدولة غير صحيح");
                if (parsed <= DateTime.UtcNow) return BadRequest("لا يمكن الجدولة فى وقت ماضٍ");
            }

            var share = new Share
            {
                OriginalPostId = postId,
                AdditionalComment = additionalComment,
                ScheduledAt = scheduledDate,
                SharedById = GetCurrentUserId()
            };

            _context.Shares.Add(share);
            await _context.SaveChangesAsync();
            return Ok(new { share.Id, isScheduled = scheduledDate != null, willPublishAt = scheduledDate });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] string? additionalComment, [FromForm] string? scheduledAt)
        {
            var share = await _context.Shares.FindAsync(id);
            if (share is null) 
                return NotFound();

            if (share.SharedById != GetCurrentUserId()) 
                return Forbid();

            if (additionalComment is not null) 
                share.AdditionalComment = additionalComment;

            if (!string.IsNullOrWhiteSpace(scheduledAt) && DateTime.TryParse(scheduledAt, out var parsed)) 
                share.ScheduledAt = parsed;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var share = await _context.Shares.FindAsync(id);
            if (share is null) return NotFound();
            if (share.SharedById != GetCurrentUserId()) return Forbid();

            _context.Shares.Remove(share);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id}/publish-now")]
        public async Task<IActionResult> PublishNow(int id)
        {
            var share = await _context.Shares.FindAsync(id);
            if (share is null) return NotFound();

            if (share.SharedById != GetCurrentUserId()) return Forbid();

            share.ScheduledAt = null;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}