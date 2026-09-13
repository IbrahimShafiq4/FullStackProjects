using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillForge.Application.Features.Quizzes;
using SkillForge.Application.Features.Quizzes.Commands;
using SkillForge.Application.Features.Quizzes.Queries;

namespace SkillForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class QuestionsController : ControllerBase
    {
        private readonly IMediator _mediator;
        public QuestionsController(IMediator mediator)
        { _mediator = mediator; }

        [HttpPost("quiz/{quizId}")]
        public async Task<IActionResult> AddQuestion(int quizId, CreateQuestionRequest req)
        {
            var options = req.Options.Select(o => (o.Text, o.IsCorrect)).ToList();
            var id = await _mediator.Send(new AddQuestionCommand(quizId, req.Text, req.Type, req.Points, options));
            return Ok(new { id });
        }

        [HttpDelete("{questionId}")]
        public async Task<IActionResult> DeleteQuestion(int questionId)
        {
            var success = await _mediator.Send(new DeleteQuestionCommand(questionId));
            return success ? NoContent() : NotFound();
        }
    }
}