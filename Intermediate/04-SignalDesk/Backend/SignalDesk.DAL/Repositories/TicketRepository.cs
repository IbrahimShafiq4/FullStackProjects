using Microsoft.EntityFrameworkCore;
using SignalDesk.DAL.Data;
using SignalDesk.DAL.Models;
using SignalDesk.DAL.Models.Enums;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace SignalDesk.DAL.Repositories
{
    public interface ITicketRepository
    {
        Task<List<Ticket>>      GetAllForUserAsync(string userId, UserRole role);
        Task<Ticket?>           GetByIdWithMessagesAsync(int id);
        Task                    AddTicketAsync(Ticket messae);
        Task                    AddMessageAsync(TicketMessage message);
        Task<TicketMessage?>    GetMessageByIdAsync(int messageId);
        Task<List<AppUser>>     GetAllAgentsAsync();
        Task<Ticket?>           GetByIdAsync(int id);
        Task                    SaveChangesAsync();
    }

    public class TicketRepository: ITicketRepository
    {
        private readonly AppDbContext _context;

        public TicketRepository(AppDbContext context)
        { _context = context; }

        public async Task<List<Ticket>> GetAllForUserAsync(string userId, UserRole role)
        {
            var query = _context.Tickets.Include(t => t.Customer).Include(t => t.AssignedAgent).AsQueryable();

            query = role == UserRole.Customer ? query.Where(t => t.CustomerId == userId) : query;

            return await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
        }

        public async Task<Ticket?> GetByIdWithMessagesAsync(int id) =>   
            await _context.Tickets.Include(t => t.Customer)
                        .Include(t => t.AssignedAgent)
                        .Include(t => t.Messages)
                        .ThenInclude(m => m.Sender)
                        .FirstOrDefaultAsync(t => t.Id == id);

        public async Task AddTicketAsync(Ticket ticket) => await _context.Tickets.AddAsync(ticket);
        public async Task AddMessageAsync(TicketMessage message) => await _context.TicketMessages.AddAsync(message);
        public async Task<TicketMessage?> GetMessageByIdAsync(int messageId) =>
            await _context.TicketMessages.FindAsync(messageId);
        public async Task<List<AppUser>> GetAllAgentsAsync() =>
            await _context.Users.Where(u => ((AppUser) u).Role == UserRole.Agent).Cast<AppUser>().ToListAsync();
        public async Task<Ticket?> GetByIdAsync(int id) =>
            await _context.Tickets
                .Include(t => t.Customer)
                .Include(t => t.AssignedAgent)
                .FirstOrDefaultAsync(t => t.Id == id);

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
