using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentBridgeAPI.Data;

namespace TalentBridgeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Employer")]
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AnalyticsController(AppDbContext context)
        { _context = context; }

        [HttpGet("job/{jobId}")]
        public async Task<IActionResult> GetJobAnalytics(int jobId)
        {
            var applications = await _context.Applications.Where(a => a.JobId == jobId).ToListAsync();
            var avgMatchScore = applications.Any() ? applications.Average(a => a.MatchScore) : 0;
            var highMatchCount = applications.Count(a => a.MatchScore >= 80);

            return Ok(new { totalApplications = applications.Count, avgMatchScore, highMatchCount });

        }
    }
}
