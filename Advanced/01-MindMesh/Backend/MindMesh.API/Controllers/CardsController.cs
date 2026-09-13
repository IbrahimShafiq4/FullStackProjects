using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMesh.Application.Features.Cards.Commands;
using MindMesh.Application.Features.Cards.DTOs;
using MindMesh.Application.Features.Cards.Queries;

namespace MindMesh.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CardsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CardsController(IMediator mediator)
        { _mediator = mediator; }

        [HttpGet("board/{boardId}")]
        public async Task<IActionResult> GetCards(int boardId)
        {
            var result = await _mediator.Send(new GetBoardCardsQuery(boardId));
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCard(CreateCardRequest request)
        {
            var cardId = await _mediator.Send(new CreateCardCommand(request.BoardId, request.Content, request.X, request.Y, request.Color));
            return Ok(new { id = cardId });
        }

        [HttpPatch("move")]
        public async Task<IActionResult> MoveCard(MoveCardRequest request)
        {
            var success = await _mediator.Send(new MoveCardCommand(request.CardId, request.X, request.Y));
            return success ? Ok() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCard(int id)
        {
            var success = await _mediator.Send(new DeleteCardComman(id));
            return success ? NoContent() : NotFound();
        }

        [HttpGet("{id}/details")]
        public async Task<IActionResult> GetCardDetails(int id)
        {
            var result = await _mediator.Send(new GetCardDetailsQuery(id));
            return result == null ? NotFound() : Ok(result);
        }
    }
}
