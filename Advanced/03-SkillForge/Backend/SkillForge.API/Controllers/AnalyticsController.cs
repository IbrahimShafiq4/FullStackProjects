using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillForge.Application.Features.Analytics;

namespace SkillForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IMediator _mediator;
        public AnalyticsController(IMediator mediator)
        { _mediator = mediator; }

        [HttpGet("quiz/{quizId}")]
        public async Task<IActionResult> GetQuizAnalytics(int quizId) =>
            Ok(await _mediator.Send(new GetQuizAnalyticsQuery(quizId)));
    }
}
