using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TalentBridgeAPI.Data;
using TalentBridgeAPI.DTOs;
using TalentBridgeAPI.Models;

namespace TalentBridgeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Candidate")]
    public class CandidatesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CandidatesController(AppDbContext context) { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetCurrentUserId();

            var user = await _context.Users.FindAsync(userId);
            var fullName = user?.FullName ?? string.Empty;

            var profile = await _context.CandidateProfiles
                .Include(p => p.Skills)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile is null)
            {
                return Ok(new CandidateProfileDto(
                    userId, fullName, string.Empty, new List<string>()));
            }

            return Ok(new CandidateProfileDto(
                userId,
                fullName,
                profile.Bio,
                profile.Skills.Select(s => s.SkillName).ToList()
            ));
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var userId = GetCurrentUserId();

            var profile = await _context.CandidateProfiles
                .Include(p => p.Skills)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile is null)
            {
                profile = new CandidateProfile { UserId = userId, Bio = dto.Bio ?? string.Empty };
                _context.CandidateProfiles.Add(profile);
            }
            else
            {
                profile.Bio = dto.Bio ?? string.Empty;
                _context.CandidateSkills.RemoveRange(profile.Skills);
            }

            profile.Skills = (dto.Skills ?? new List<string>())
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .Select(s => new CandidateSkill { SkillName = s.Trim() })
                .ToList();

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم تحديث البروفايل بنجاح" });
        }
    }
}