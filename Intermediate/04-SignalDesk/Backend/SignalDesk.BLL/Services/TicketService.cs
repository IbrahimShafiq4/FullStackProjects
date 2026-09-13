using SignalDesk.BLL.DTOs.Tickets;
using SignalDesk.DAL.Models;
using SignalDesk.DAL.Models.Enums;
using SignalDesk.DAL.Repositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace SignalDesk.BLL.Services
{
    public interface ITicketService
    {
        Task<TicketDto>         CreateTicketAsync(string customerId, CreateTicketDto dto);
        Task<List<TicketDto>>   GetTicketsAsync(string userId, UserRole role);
    }

    public class TicketService : ITicketService
    {
        private readonly ITicketRepository _TicketRepo;
        private readonly ISlaCalculator _SlaCalculator;

        public TicketService(
            ITicketRepository ticketRepository,
            ISlaCalculator slaCalculator)
        {
            _TicketRepo = ticketRepository;
            _SlaCalculator = slaCalculator;
        }

        public async Task<TicketDto> CreateTicketAsync(
            string customerId,
            CreateTicketDto dto)
        {
            var CreatedAt = DateTime.UtcNow;

            var ticket = new Ticket
            {
                Subject = dto.Subject,
                Priority = dto.Priority,
                CustomerId = customerId,
                CreatedAt = CreatedAt,
                SlaDeadline = _SlaCalculator.CalculatedDeadline(
                    dto.Priority,
                    CreatedAt
                )
            };

            await _TicketRepo.AddTicketAsync(ticket);
            await _TicketRepo.SaveChangesAsync();

            var createdTicket =
                await _TicketRepo.GetByIdWithMessagesAsync(ticket.Id);

            if (createdTicket == null)
                throw new InvalidOperationException(
                    "Ticket was not found after creation."
                );

            return MapToDto(createdTicket);
        }

        public async Task<List<TicketDto>> GetTicketsAsync(
            string userId,
            UserRole role)
        {
            var tickets = await _TicketRepo.GetAllForUserAsync(userId, role);

            return tickets.Select(MapToDto).ToList();
        }

        private TicketDto MapToDto(Ticket t) => new()
        {
            Id = t.Id,
            Subject = t.Subject,
            Status = t.Status.ToString(),
            Priority = t.Priority.ToString(),
            CreatedAt = t.CreatedAt,
            SlaDeadline = t.SlaDeadline,
            IsOverdue = _SlaCalculator.IsOverdue(t.SlaDeadline),
            IsNearingDeadline = _SlaCalculator.IsNearingDeadline(t.SlaDeadline),
            CustomerName = t.Customer.FullName,
            AssignedAgentName = t.AssignedAgent?.FullName
        };
    }
}
