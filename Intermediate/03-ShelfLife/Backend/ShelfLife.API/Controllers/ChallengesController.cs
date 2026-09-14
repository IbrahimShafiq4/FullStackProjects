using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShelfLife.Application.DTOs;
using ShelfLife.Domain.Entities;
using ShelfLife.Infrastructure.Data;
using System.Security.Claims;

namespace ShelfLife.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChallengesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public ChallengesController(AppDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        private async Task<bool> IsCurrentUserAdminAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            Console.WriteLine($"USER ID FROM TOKEN: {userId}");

            if (string.IsNullOrEmpty(userId))
                return false;

            var user = await _userManager.FindByIdAsync(userId);

            Console.WriteLine($"USER FOUND: {user != null}");
            Console.WriteLine($"IS ADMIN: {user?.IsAdmin}");

            return user?.IsAdmin ?? false;
        }

        [HttpGet("active")]
        [AllowAnonymous]
        public async Task<IActionResult> GetActive()
        {
            var challenge = await _context.Challenges
                .Where(c => c.IsActive)
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefaultAsync();

            if (challenge is null) return Ok(null);

            return Ok(new ChallengeDto
            {
                Id = challenge.Id,
                Title = challenge.Title,
                Description = challenge.Description,
                Reward = challenge.Reward,
                Days = challenge.Days,
                Target = challenge.Target,
                IsActive = challenge.IsActive,
                CreatedAt = challenge.CreatedAt
            });
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            if (!await IsCurrentUserAdminAsync()) return Forbid();

            var challenges = await _context.Challenges
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new ChallengeDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Reward = c.Reward,
                    Days = c.Days,
                    Target = c.Target,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            return Ok(challenges);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateChallengeDto dto)
        {
            if (!await IsCurrentUserAdminAsync()) return Forbid();

            if (string.IsNullOrWhiteSpace(dto.Title) ||
                string.IsNullOrWhiteSpace(dto.Description) ||
                string.IsNullOrWhiteSpace(dto.Reward))
                return BadRequest("كل الحقول مطلوبة");

            if (dto.Days < 1 || dto.Target < 1)
                return BadRequest("الأيام والهدف لازم يكونوا أكبر من صفر");

            // Deactivate old active challenge
            var activeChallenges = await _context.Challenges.Where(c => c.IsActive).ToListAsync();
            foreach (var c in activeChallenges) c.IsActive = false;

            var challenge = new Challenge
            {
                Title = dto.Title.Trim(),
                Description = dto.Description.Trim(),
                Reward = dto.Reward.Trim(),
                Days = dto.Days,
                Target = dto.Target,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Challenges.Add(challenge);
            await _context.SaveChangesAsync();

            return Ok(new { id = challenge.Id, message = "تم إضافة التحدي" });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateChallengeDto dto)
        {
            if (!await IsCurrentUserAdminAsync()) return Forbid();

            var challenge = await _context.Challenges.FindAsync(id);
            if (challenge is null) return NotFound();

            challenge.Title = dto.Title.Trim();
            challenge.Description = dto.Description.Trim();
            challenge.Reward = dto.Reward.Trim();
            challenge.Days = dto.Days;
            challenge.Target = dto.Target;
            challenge.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم التحديث" });
        }

        [HttpPatch("{id}/activate")]
        [Authorize]
        public async Task<IActionResult> Activate(int id)
        {
            if (!await IsCurrentUserAdminAsync()) return Forbid();

            var allActive = await _context.Challenges.Where(c => c.IsActive).ToListAsync();
            foreach (var c in allActive) c.IsActive = false;

            var challenge = await _context.Challenges.FindAsync(id);
            if (challenge is null) return NotFound();

            challenge.IsActive = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم تفعيل التحدي" });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            if (!await IsCurrentUserAdminAsync()) return Forbid();

            var challenge = await _context.Challenges.FindAsync(id);
            if (challenge is null) return NotFound();

            _context.Challenges.Remove(challenge);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم الحذف" });
        }
    }
}