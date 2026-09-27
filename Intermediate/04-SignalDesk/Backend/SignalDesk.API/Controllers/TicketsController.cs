using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SignalDesk.BLL.DTOs.Tickets;
using SignalDesk.BLL.Services;
using SignalDesk.DAL.Models.Enums;
using System.Security.Claims;

namespace SignalDesk.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketsController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException();

        private UserRole GetCurrentRole()
        {
            var roleValue = User.FindFirstValue(ClaimTypes.Role);
            if (!Enum.TryParse<UserRole>(roleValue, true, out var role))
                throw new UnauthorizedAccessException("Invalid role");
            return role;
        }

        [HttpGet]
        public async Task<ActionResult> GetTickets([FromQuery] TicketFilterDto filter)
        {
            var result = await _ticketService.GetFilteredAsync(GetCurrentUserId(), GetCurrentRole(), filter);
            return Ok(result);
        }

        [HttpGet("stats")]
        public async Task<ActionResult<TicketStatsDto>> GetStats()
        {
            var stats = await _ticketService.GetStatsAsync(GetCurrentUserId(), GetCurrentRole());
            return Ok(stats);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TicketDto>> GetTicket(int id)
        {
            var tickets = await _ticketService.GetTicketsAsync(GetCurrentUserId(), GetCurrentRole());
            var ticket = tickets.FirstOrDefault(t => t.Id == id);
            if (ticket == null) return NotFound();
            return Ok(ticket);
        }

        [HttpPost]
        [Authorize(Roles = nameof(UserRole.Customer))]
        public async Task<ActionResult<TicketDto>> CreateTicket(CreateTicketDto dto)
        {
            var ticket = await _ticketService.CreateTicketAsync(GetCurrentUserId(), dto);
            return Ok(ticket);
        }

        [HttpPatch("{id:int}/status")]
        public async Task<ActionResult<TicketDto>> UpdateStatus(int id, UpdateTicketStatusDto dto)
        {
            var result = await _ticketService.UpdateStatusAsync(id, GetCurrentUserId(), GetCurrentRole(), dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPatch("{id:int}/assign")]
        [Authorize(Roles = nameof(UserRole.Agent))]
        public async Task<ActionResult<TicketDto>> Assign(int id, AssignTicketDto dto)
        {
            var result = await _ticketService.AssignAsync(id, GetCurrentUserId(), GetCurrentRole(), dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("{id:int}/notes")]
        [Authorize(Roles = nameof(UserRole.Agent))]
        public async Task<ActionResult<List<TicketNoteDto>>> GetNotes(int id)
        {
            var notes = await _ticketService.GetNotesAsync(id, GetCurrentUserId(), GetCurrentRole());
            return Ok(notes);
        }

        [HttpPost("{id:int}/notes")]
        [Authorize(Roles = nameof(UserRole.Agent))]
        public async Task<ActionResult<TicketNoteDto>> AddNote(int id, CreateTicketNoteDto dto)
        {
            var note = await _ticketService.AddNoteAsync(id, GetCurrentUserId(), dto);
            return Ok(note);
        }

        [HttpGet("debug-auth")]
        public IActionResult DebugAuth()
        {
            return Ok(User.Claims.Select(c => new
            {
                c.Type,
                c.Value
            }));
        }
    }
}