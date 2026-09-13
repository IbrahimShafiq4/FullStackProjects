using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Interfaces;
using SkillForge.Domain.Entities;

namespace SkillForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CandidatesController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public CandidatesController(IAppDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var candidate = await _context.Candidates
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (candidate is null)
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user is null) return Unauthorized();

                candidate = new Candidate
                {
                    FullName = user.FullName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    UserId = userId
                };

                await _context.Candidates.AddAsync(candidate);
                await _context.SaveChangesAsync();
            }

            return Ok(new { candidate.Id, candidate.FullName, candidate.Email });
        }
    }
}