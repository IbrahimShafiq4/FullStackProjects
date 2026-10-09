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
    public class FollowsController : Controller
    {
        private readonly IAppDbContext _context;
        public FollowsController(IAppDbContext context )
        { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Follows
                .Where(f => f.FollowerId == GetCurrentUserId())
                .Select(f => new { f.Id, f.FollowingId, f.FollowedAt })
                .ToListAsync()
            );

        [HttpGet("followId:int")]
        public async Task<IActionResult> GetById(int followId)
        {
            var follow = await _context.Follows.FindAsync(followId);
            return follow == null ? NotFound() : Ok(new { follow.Id, follow.FollowingId, follow.FollowedAt });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] string followingId)
        {
            var followerId = GetCurrentUserId();
            var alreadyExists = await _context.Follows
                .AnyAsync(f => 
                f.FollowingId == followingId && 
                f.FollowerId == followerId);

            if (alreadyExists) return BadRequest("أنت تتابع هذا الشخص بالفعل.");

            var follow = new Follow { FollowerId = followerId, FollowingId = followingId };
            _context.Follows.Add(follow);
            await _context.SaveChangesAsync();
            return Ok(new { follow.Id });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id)
        {
            var follow = await _context.Follows.FindAsync(id);
            if (follow is null) return NotFound();

            follow.FollowedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var follow = await _context.Follows.FindAsync(id);
            if (follow is null) return NotFound();

            if (follow.FollowerId != GetCurrentUserId()) return Forbid();

            _context.Follows.Remove(follow);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
