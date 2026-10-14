using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using R_FIT.Application.Interfaces;
using R_FIT.Domain.Entities;
using System.Security.Claims;

namespace R_FIT.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReactionsController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public ReactionsController(IAppDbContext context)
        { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("post/{postId:int}")]
        public async Task<IActionResult> GetByPost(int postId)
        {
            var reactions = await _context.Reactions.Where(r => r.PostId == postId)
                .ToListAsync();

            var grouped = reactions.GroupBy(r => r.Type).ToDictionary(g => g.Key.ToString(), g => g.Count());
            return Ok(new { total = reactions.Count, byType = grouped });
        }

        [HttpGet("{reactionId:int}")]
        public async Task<IActionResult> GetById(int reactionId)
        {
            var reaction = await _context.Reactions.FindAsync(reactionId);
            return reaction is null ? NotFound() : Ok(new { reaction.Id, reaction.PostId, Type = reaction.Type.ToString() });
        }

        [HttpPost("post/{postId:int}")]
        public async Task<IActionResult> Create(int postId, [FromBody] string type)
        {
            if (!Enum.TryParse<ReactionType>(type, true, out var reactionType))
                return BadRequest("نوع التفاعل غير صحيح");

            var userId = GetCurrentUserId();
            var existing = await _context.Reactions.FirstOrDefaultAsync(r => r.PostId == postId && r.UserId == userId);

            if (existing is not null)
            {
                existing.Type = reactionType;
                await _context.SaveChangesAsync();
                return Ok(new { existing.Id, message = "تم تحديث تفاعلك" });
            }

            var reaction = new Reaction
            {
                PostId = postId,
                Type = reactionType,
                UserId = userId
            };

            _context.Reactions.Add(reaction);
            await _context.SaveChangesAsync();
            return Ok(new { reaction.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] string type)
        {
            if (!Enum.TryParse<ReactionType>(type, true, out var reactionType))
                return BadRequest("نوع التفاعل غير صحيح.");

            var reaction = await _context.Reactions.FindAsync(id);
            if (reaction is null) return NotFound();
            reaction.Type = reactionType;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var reaction = await _context.Reactions.FindAsync(id);
            if (reaction is null) return NotFound();
            if (reaction.UserId != GetCurrentUserId()) return Forbid();
            _context.Reactions.Remove(reaction);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("my/post/{postId:int}")]
        public async Task<IActionResult> GetMyReaction(int postId)
        {
            var reaction = await _context.Reactions.FirstOrDefaultAsync(r => r.PostId == postId && r.UserId == GetCurrentUserId());
            return Ok(new { hasReacted = reaction != null, type = reaction?.Type.ToString() });
        }
    }
}
