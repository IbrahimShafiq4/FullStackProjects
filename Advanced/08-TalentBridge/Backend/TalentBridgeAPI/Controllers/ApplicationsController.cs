using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TalentBridgeAPI.Data;
using TalentBridgeAPI.Models;
using TalentBridgeAPI.Services;

namespace TalentBridgeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext           _context;
        private readonly IMatchingService       _matchingService;
        private readonly INotificationService   _notificationService;

        public ApplicationsController(
                AppDbContext context,
                IMatchingService matchingService,
                INotificationService notificationService
            )
        {
            _context                = context;
            _matchingService        = matchingService;
            _notificationService    = notificationService;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost("job/{jobId}")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> Apply(int jobId)
        {
            var candidateId = GetCurrentUserId();

            var alreadyApplied = await _context.Applications.AnyAsync(
                    a => a.JobId == jobId && a.CandidateId == GetCurrentUserId()
                );

            if (alreadyApplied) return BadRequest("لقد تقدمت لهذه الوظيفة بالفعل.");

            var job = await _context.Jobs
                .Include(j => j.RequiredSkills).FirstOrDefaultAsync(j => j.Id == jobId);
            if (job is null) return NotFound();

            var profile = await _context.CandidateProfiles.Include(p => p.Skills).FirstOrDefaultAsync(p => p.UserId == candidateId);
            var candidateSkills = profile?.Skills ?? new List<CandidateSkill>();

            var matchScore = _matchingService.CalculateMatchScore(candidateSkills, job.RequiredSkills);

            var application = new Application { JobId = jobId, CandidateId = candidateId, MatchScore = matchScore };
            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            if (matchScore >= 80)
            {
                await _notificationService.NotifyAsync(job.EmployerId, $"متقدم جديد بنسبة توافق عالية ({matchScore}%) على وظيفة {job.Title}!");
            }

            return Ok(new { application.Id, matchScore });
        }

        [HttpGet("job/{jobId}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetApplicationsForJob(int jobId)
        {
            var applications = await _context.Applications
                .Where(a => a.JobId == jobId)
                .OrderByDescending(a => a.MatchScore)
                .Select(a => new { a.Id, a.CandidateId, a.MatchScore, Status = a.Status.ToString(), a.AppliedAt })
                .ToListAsync();

            return Ok(applications);
        }
    }
}
