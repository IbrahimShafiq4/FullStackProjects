using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TalentBridgeAPI.Data;
using TalentBridgeAPI.DTOs;
using TalentBridgeAPI.Models;
using TalentBridgeAPI.Services;

namespace TalentBridgeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMatchingService _matchingService;
        private readonly INotificationService _notificationService;

        public ApplicationsController(
            AppDbContext context,
            IMatchingService matchingService,
            INotificationService notificationService)
        {
            _context = context;
            _matchingService = matchingService;
            _notificationService = notificationService;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        // ── Candidate: apply to a job ─────────────────────────────────
        [HttpPost("job/{jobId:int}")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> Apply(int jobId)
        {
            var candidateId = GetCurrentUserId();

            var alreadyApplied = await _context.Applications
                .AnyAsync(a => a.JobId == jobId && a.CandidateId == candidateId);

            if (alreadyApplied)
                return BadRequest("لقد تقدمت لهذه الوظيفة بالفعل.");

            var job = await _context.Jobs
                .Include(j => j.RequiredSkills)
                .FirstOrDefaultAsync(j => j.Id == jobId);

            if (job is null) return NotFound();

            var profile = await _context.CandidateProfiles
                .Include(p => p.Skills)
                .FirstOrDefaultAsync(p => p.UserId == candidateId);

            var candidateSkills = profile?.Skills ?? new List<CandidateSkill>();
            var matchScore = _matchingService.CalculateMatchScore(
                candidateSkills, job.RequiredSkills);

            var application = new Application
            {
                JobId = jobId,
                CandidateId = candidateId,
                MatchScore = matchScore,
                Status = ApplicationStatus.Pending
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            if (matchScore >= 80)
            {
                await _notificationService.NotifyAsync(
                    job.EmployerId,
                    $"متقدم جديد بنسبة توافق عالية ({matchScore}%) على وظيفة {job.Title}!");
            }

            return Ok(new { application.Id, matchScore });
        }

        // ── Candidate: list my applications ───────────────────────────
        [HttpGet("my")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> GetMyApplications()
        {
            var candidateId = GetCurrentUserId();

            var rows = await _context.Applications
                .Where(a => a.CandidateId == candidateId)
                .Include(a => a.Job)
                    .ThenInclude(j => j.Employer)
                .OrderByDescending(a => a.AppliedAt)
                .Select(a => new MyApplicationDto(
                    a.Id,
                    a.JobId,
                    a.Job.Title,
                    a.Job.Employer.FullName,
                    a.MatchScore,
                    a.Status.ToString(),
                    a.AppliedAt
                ))
                .ToListAsync();

            return Ok(rows);
        }

        // ── Employer: list applications for a job (with candidate info) ─
        [HttpGet("job/{jobId:int}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetApplicationsForJob(int jobId)
        {
            var rows = await _context.Applications
                .Where(a => a.JobId == jobId)
                .Include(a => a.Job)
                .OrderByDescending(a => a.MatchScore)
                .ToListAsync();

            // candidate user info
            var candidateIds = rows.Select(r => r.CandidateId).Distinct().ToList();

            var users = await _context.Users
                .Where(u => candidateIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => u.FullName);

            var profiles = await _context.CandidateProfiles
                .Include(p => p.Skills)
                .Where(p => candidateIds.Contains(p.UserId))
                .ToListAsync();

            var profileMap = profiles.ToDictionary(
                p => p.UserId,
                p => (p.Bio, Skills: p.Skills.Select(s => s.SkillName).ToList())
            );

            var result = rows.Select(a =>
            {
                var hasProfile = profileMap.TryGetValue(a.CandidateId, out var prof);
                return new EmployerApplicationDto(
                    a.Id,
                    a.CandidateId,
                    users.TryGetValue(a.CandidateId, out var name) ? name : "—",
                    hasProfile ? prof.Bio : string.Empty,
                    hasProfile ? prof.Skills : new List<string>(),
                    a.MatchScore,
                    a.Status.ToString(),
                    a.AppliedAt
                );
            });

            return Ok(result);
        }

        // ── Employer: update application status ──────────────────────
        public record UpdateStatusDto(string Status);

        [HttpPatch("{id:int}/status")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateStatusDto dto)
        {
            var app = await _context.Applications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (app is null) return NotFound();
            if (app.Job.EmployerId != GetCurrentUserId()) return Forbid();

            if (!Enum.TryParse<ApplicationStatus>(dto.Status, true, out var status))
                return BadRequest(new { message = "حالة غير معروفة." });

            app.Status = status;
            await _context.SaveChangesAsync();

            var label = status switch
            {
                ApplicationStatus.Pending => "قيد الانتظار",
                ApplicationStatus.Reviewd => "قيد المراجعة",
                ApplicationStatus.Accepted => "قائمة مختصرة",
                ApplicationStatus.Rejected => "مرفوض",
                _ => status.ToString()
            };

            await _notificationService.NotifyAsync(
                app.CandidateId,
                $"تحديث على طلبك في \"{app.Job.Title}\": {label}."
            );

            return Ok(new { app.Id, status = app.Status.ToString() });
        }
    }
}