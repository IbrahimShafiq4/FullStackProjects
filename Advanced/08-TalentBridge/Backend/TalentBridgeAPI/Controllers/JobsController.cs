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
        public JobsController(AppDbContext context) { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        private static JobDto ToDto(Job j) => new(
            j.Id,
            j.Title,
            j.Description,
            j.Location,
            j.WorkMode.ToString(),
            j.SalaryMin,
            j.SalaryMax,
            j.Employer?.FullName ?? string.Empty,
            j.EmployerId,
            j.CreatedAt,
            j.RequiredSkills.Where(s => s.Importance == SkillImportance.MustHave)
                            .Select(s => s.SkillName).ToList(),
            j.RequiredSkills.Where(s => s.Importance == SkillImportance.NiceToHave)
                            .Select(s => s.SkillName).ToList()
        );

        [HttpGet]
        public async Task<IActionResult> GetJobs()
        {
            var jobs = await _context.Jobs
                .Include(j => j.Employer)
                .Include(j => j.RequiredSkills)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            return Ok(jobs.Select(ToDto));
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _context.Jobs
                .Include(j => j.Employer)
                .Include(j => j.RequiredSkills)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job is null) return NotFound();

            return Ok(ToDto(job));
        }

        [HttpPost]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> CreateJob(CreateJobDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "عنوان الوظيفة مطلوب." });

            if (!Enum.TryParse<WorkMode>(dto.WorkMode, true, out var mode))
                mode = WorkMode.OnSite;

            var job = new Job
            {
                Title = dto.Title.Trim(),
                Description = dto.Description?.Trim() ?? string.Empty,
                Location = dto.Location?.Trim() ?? string.Empty,
                WorkMode = mode,
                SalaryMin = dto.SalaryMin,
                SalaryMax = dto.SalaryMax,
                EmployerId = GetCurrentUserId(),
                RequiredSkills = dto.RequiredSkills
                    .Where(s => !string.IsNullOrWhiteSpace(s.SkillName))
                    .Select(s => new JobSkillRequirement
                    {
                        SkillName = s.SkillName.Trim(),
                        Importance = Enum.TryParse<SkillImportance>(s.Importance, true, out var imp)
                                     ? imp
                                     : SkillImportance.MustHave
                    })
                    .ToList()
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();
            return Ok(new { job.Id });
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Employer")]
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