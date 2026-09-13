using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMesh.Application.Interfaces;

namespace MindMesh.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatsController : ControllerBase
    {
        private readonly IStatsService _statsService;

        public StatsController(IStatsService statsService)
        {
            _statsService = statsService;
        }

        [HttpGet("overview")]
        [AllowAnonymous]
        public async Task<IActionResult> GetOverview()
        {
            var stats = await _statsService.GetOverviewStatsAsync();
            return Ok(stats);
        }
    }
}
