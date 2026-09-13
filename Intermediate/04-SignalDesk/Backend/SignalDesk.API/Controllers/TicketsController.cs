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

        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException();
        }

        private UserRole GetCurrentRole()
        {
            var roleValue = User.FindFirstValue(ClaimTypes.Role);

            if (!Enum.TryParse<UserRole>(
                roleValue,
                ignoreCase: true,
                out var role))
            {
                throw new UnauthorizedAccessException("Invalid role");
            }

            return role;
        }

        [HttpGet]
        public async Task<ActionResult<List<TicketDto>>> GetTickets()
        {
            var tickets = await _ticketService.GetTicketsAsync(GetCurrentUserId(), GetCurrentRole());
            return Ok(tickets);
        }

        [HttpPost]
        [Authorize(Roles = nameof(UserRole.Customer))]
        public async Task<ActionResult<TicketDto>> CreateTicket(CreateTicketDto dto)
        {
            var ticket = await _ticketService.CreateTicketAsync(
                GetCurrentUserId(),
                dto
            );

            return Ok(ticket);
        }
    }
}
