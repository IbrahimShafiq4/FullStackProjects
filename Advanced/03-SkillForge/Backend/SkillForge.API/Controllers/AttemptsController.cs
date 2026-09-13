using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillForge.Application.Features.Attempts;
using SkillForge.Application.Features.Attempts.Commands;

namespace SkillForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AttemptsController : ControllerBase
    {
        private readonly IMediator _mediator;
        public AttemptsController(IMediator mediator)
        { _mediator = mediator; }

        [HttpPost("start")]
        public async Task<IActionResult> StartAttempt([FromQuery] int quizId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _mediator.Send(new StartAttemptCommand(quizId, userId));
            return Ok(result);
        }

        [HttpPost("{attemptId}/submit")]
        public async Task<IActionResult> SubmitAttempt(int attemptId, SubmitAttemptRequest req)
        {
            var answers = req.Answers.Select(a => (a.QuestionId, a.SelectedOptionIds)).ToList();
            var result = await _mediator.Send(new SubmitAttemptCommand(attemptId, answers));
            return Ok(result);
        }
    }
}