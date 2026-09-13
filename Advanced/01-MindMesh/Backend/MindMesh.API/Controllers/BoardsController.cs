using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindMesh.Application.Features.Boards.Queries;
using MindMesh.Application.Interfaces;
using MindMesh.Domain.Entities;
using System.Security.Claims;

namespace MindMesh.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BoardsController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly IMediator _mediator;

        public BoardsController(IAppDbContext context, IMediator mediator)
        { _context = context; _mediator = mediator; }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetMyBoards()
        {
            var boards = await _context.Boards
                .Where(b => b.OwnerId == GetCurrentUserId())
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.CreatedAt,
                    CardsCount = b.Cards.Count
                })
                .ToListAsync();

            return Ok(boards);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBoard([FromBody] string title)
        {
            var board = new Board { Title = title, OwnerId = GetCurrentUserId() };
            _context.Boards.Add(board);
            await _context.SaveChangesAsync();
            return Ok(new { board.Id });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBoardDetails(int id)
        {
            var board = await _context.Boards
                                      .Where(b => b.Id == id)
                                      .Select(b => new { b.Id, b.Title, b.CreatedAt, b.OwnerId, CardsCount = b.Cards.Count })
                                      .FirstOrDefaultAsync();
            if (board is null) return NotFound();
            return Ok(board);
        }

        [HttpGet("{id}/analytics")]
        public async Task<IActionResult> GetAnalytics(int id)
        {
            var result = await _mediator.Send(new GetBoardAnalyticsQuery(id));
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBoard(int id)
        {
            var board = await _context.Boards.FindAsync(id);

            if (board is null)
                return NotFound();

            if (board.OwnerId != GetCurrentUserId())
                return Forbid();

            _context.Boards.Remove(board);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
