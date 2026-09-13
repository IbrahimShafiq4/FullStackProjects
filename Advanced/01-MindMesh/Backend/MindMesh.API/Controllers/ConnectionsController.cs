using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMesh.Application.Features.Connections.Commands;
using MindMesh.Application.Features.Connections.DTOs;
using MindMesh.Application.Features.Connections.Queries;

namespace MindMesh.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConnectionsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ConnectionsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("board/{boardId}")]
        public async Task<IActionResult> GetBoardConnections(int boardId)
        {
            var connections = await _mediator.Send(new GetBoardConnectionsQuery(boardId));
            return Ok(connections);
        }

        [HttpPost]
        public async Task<IActionResult> CreateConnection(CreateConnectionRequest request)
        {
            var id = await _mediator.Send(new CreateConnectionCommand(
                request.BoardId,
                request.FromCardId,
                request.ToCardId,
                request.Color
            ));
            return Ok(new { id });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConnection(int id)
        {
            var success = await _mediator.Send(new DeleteConnectionCommand(id));
            return success ? NoContent() : NotFound();
        }
    }
}
