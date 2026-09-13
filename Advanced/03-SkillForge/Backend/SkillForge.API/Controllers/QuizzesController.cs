using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillForge.Application.Features.Quizzes;
using SkillForge.Application.Features.Quizzes.Commands;
using SkillForge.Application.Features.Quizzes.Queries;
using System.Security.Claims;

namespace SkillForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class QuizzesController : ControllerBase
    {
        private readonly IMediator _mediator;
        public QuizzesController(IMediator mediator)
        { _mediator = mediator; }

        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetCompanyQuizzes(int companyId) =>
            Ok(await _mediator.Send(new GetCompanyQuizzesQuery(companyId)));

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableQuizzes()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            return Ok(await _mediator.Send(new GetAvailableQuizzesQuery(userId)));
        }

        [HttpPost]
        public async Task<IActionResult> CreateQuiz(CreateQuizRequest req)
        {
            var id = await _mediator.Send(new CreateQuizCommand(req.CompanyId, req.Title, req.DurationMinutes));
            return Ok(new { id });
        }

        [HttpDelete("{id}/company/{companyId}")]
        public async Task<IActionResult> DeleteQuiz(int id, int companyId)
        {
            var success = await _mediator.Send(new DeleteQuizCommand(id, companyId));
            return success ? NoContent() : NotFound();
        }

        [HttpGet("{id}/for-candidate")]
        public async Task<IActionResult> GetQuizForCandidate(int id)
        {
            var result = await _mediator.Send(new GetQuizForCandidateQuery(id));
            return result == null ? NotFound() : Ok(result);
        }
    }
}