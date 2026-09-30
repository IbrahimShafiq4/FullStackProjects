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
    [Authorize]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public JobsController(AppDbContext context)
        { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetJobs()
        {
            var jobs = await _context.Jobs
                .Include(j => j.Employer)
                .Include(j => j.RequiredSkills)
                .ToListAsync();

            return Ok(jobs.Select(j => new JobDto(j.Id, j.Title, j.Description, j.Employer.FullName,
                j.RequiredSkills.Where(s => s.Importance == SkillImportance.MustHave).Select(s => s.SkillName).ToList(),
                j.RequiredSkills.Where(s => s.Importance == SkillImportance.NiceToHave).Select(s => s.SkillName).ToList())));
        }

        [HttpPost]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> CreateJobs(CreateJobDto dto)
        {
            var job = new Job
            {
                Title = dto.Title,
                Description = dto.Description,
                EmployerId = GetCurrentUserId(),
                RequiredSkills = dto.RequiredSkills.Select(s => new JobSkillRequirement
                {
                    SkillName = s.SkillName,
                    Importance = Enum.Parse<SkillImportance>(s.Importance, true)
                }).ToList()
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();
            return Ok(new { job.Id });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job is null) return NotFound();
            if (job.EmployerId != GetCurrentUserId()) return Forbid();
            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم حذف الوظيفة بنجاح" });
        }
    }
}
