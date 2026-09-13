using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillForge.Application.Features.Testimonials;
using SkillForge.Application.Features.Testimonials.Commands;
using System.Security.Claims;

namespace SkillForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestimonialsController : ControllerBase
    {
        private readonly IMediator _mediator;
        public TestimonialsController(IMediator mediator)
        { _mediator = mediator; }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublished([FromQuery] int take = 12) =>
            Ok(await _mediator.Send(new GetPublishedTestimonialsQuery(take)));

        [HttpGet("mine")]
        [Authorize]
        public async Task<IActionResult> GetMine()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            return Ok(await _mediator.Send(new GetMyTestimonialsQuery(userId)));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateTestimonialRequest req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (string.IsNullOrWhiteSpace(req.Message) || req.Message.Length < 20)
                return BadRequest("الرأي يجب أن يكون 20 حرفاً على الأقل");

            var id = await _mediator.Send(new CreateTestimonialCommand(
                userId, req.AuthorName, req.AuthorRole, req.Message, req.Rating));

            return Ok(new { id });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var ok = await _mediator.Send(new DeleteTestimonialCommand(id, userId));
            return ok ? NoContent() : Forbid();
        }
    }
}
