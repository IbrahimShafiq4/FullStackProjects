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
        public CandidatesController(AppDbContext context)
        { _context = context; }
        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var profile = await _context.CandidateProfiles
                .Include(p => p.Skills)
                .FirstOrDefaultAsync(p => p.UserId == GetCurrentUserId());

            if (profile is null)
            {
                profile = new CandidateProfile { UserId = GetCurrentUserId(), Bio = dto.Bio };
                _context.CandidateProfiles.Add(profile);
            }
            else
            {
                profile.Bio = dto.Bio;
                _context.CandidateSkills.RemoveRange(profile.Skills);
            }
            profile.Skills = dto.Skills.Select(s => new CandidateSkill { SkillName = s }).ToList();
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم تحديث البروفايل بنجاح" });
        }
    }
}
