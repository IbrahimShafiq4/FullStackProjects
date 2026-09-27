using Microsoft.EntityFrameworkCore;
using SignalDesk.DAL.Data;
using SignalDesk.DAL.Models;
using SignalDesk.DAL.Models.Enums;
using SignalDesk.DAL.Models.Tickets;

namespace SignalDesk.DAL.Repositories
{
    public class TicketRepository : ITicketRepository
    {
        private readonly AppDbContext _context;

        public TicketRepository(AppDbContext context)
        {
            _context = context;
        }

        private IQueryable<Ticket> BaseQuery()
        {
            return _context.Tickets
                .Include(t => t.Customer)
                .Include(t => t.AssignedAgent)
                .AsQueryable();
        }

        public async Task<List<Ticket>> GetAllForUserAsync(string userId, UserRole role)
        {
            var query = BaseQuery();

            if (role == UserRole.Customer)
                query = query.Where(t => t.CustomerId == userId);

            return await query
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<(List<Ticket> Items, int Total)> GetFilteredAsync(
            string userId,
            UserRole role,
            TicketFilter filter)
        {
            var query = BaseQuery();

            if (role == UserRole.Customer)
                query = query.Where(t => t.CustomerId == userId);

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var search = filter.Search.Trim().ToLower();

                query = query.Where(t =>
                    t.Subject.ToLower().Contains(search) ||
                    (t.Description != null && t.Description.ToLower().Contains(search)) ||
                    (t.Tags != null && t.Tags.ToLower().Contains(search)) ||
                    t.Customer.FullName.ToLower().Contains(search));
            }

            if (filter.Status.HasValue)
                query = query.Where(t => t.Status == filter.Status.Value);

            if (filter.Priority.HasValue)
                query = query.Where(t => t.Priority == filter.Priority.Value);

            if (filter.Category.HasValue)
                query = query.Where(t => t.Category == filter.Category.Value);

            if (!string.IsNullOrEmpty(filter.AssignedAgentId))
                query = query.Where(t => t.AssignedAgentId == filter.AssignedAgentId);

            if (filter.AssignedToMe == true)
                query = query.Where(t => t.AssignedAgentId == userId);

            if (filter.Unassigned == true)
                query = query.Where(t => t.AssignedAgentId == null);

            if (filter.Overdue == true)
            {
                query = query.Where(t =>
                    t.SlaDeadline < DateTime.UtcNow &&
                    t.Status != TicketStatus.Resolved &&
                    t.Status != TicketStatus.Closed);
            }

            query = (filter.SortBy?.ToLower(), filter.SortDir?.ToLower()) switch
            {
                ("priority", "asc") => query.OrderBy(t => t.Priority),
                ("priority", _) => query.OrderByDescending(t => t.Priority),
                ("deadline", "asc") => query.OrderBy(t => t.SlaDeadline),
                ("deadline", _) => query.OrderByDescending(t => t.SlaDeadline),
                ("updated", "asc") => query.OrderBy(t => t.UpdatedAt ?? t.CreatedAt),
                ("updated", _) => query.OrderByDescending(t => t.UpdatedAt ?? t.CreatedAt),
                (_, "asc") => query.OrderBy(t => t.CreatedAt),
                _ => query.OrderByDescending(t => t.CreatedAt)
            };

            var total = await query.CountAsync();

            var page = filter.Page < 1 ? 1 : filter.Page;
            var pageSize = filter.PageSize < 1
                ? 20
                : Math.Min(filter.PageSize, 100);

            var items = await query
                .Include(t => t.Messages)
                .Include(t => t.Notes)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }

        public async Task<List<Ticket>> GetAllForStatsAsync(string userId, UserRole role)
        {
            var query = _context.Tickets.AsQueryable();

            if (role == UserRole.Customer)
                query = query.Where(t => t.CustomerId == userId);

            return await query.ToListAsync();
        }

        public async Task<Ticket?> GetByIdWithMessagesAsync(int id)
        {
            return await _context.Tickets
                .Include(t => t.Customer)
                .Include(t => t.AssignedAgent)
                .Include(t => t.Messages)
                    .ThenInclude(m => m.Sender)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Ticket?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.Tickets
                .Include(t => t.Customer)
                .Include(t => t.AssignedAgent)
                .Include(t => t.Messages)
                    .ThenInclude(m => m.Sender)
                .Include(t => t.Notes)
                    .ThenInclude(n => n.Author)
                .Include(t => t.StatusHistory)
                    .ThenInclude(h => h.ChangedBy)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Ticket?> GetByIdAsync(int id)
        {
            return await _context.Tickets
                .Include(t => t.Customer)
                .Include(t => t.AssignedAgent)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task AddTicketAsync(Ticket ticket)
        {
            await _context.Tickets.AddAsync(ticket);
        }

        public async Task AddMessageAsync(TicketMessage message)
        {
            await _context.TicketMessages.AddAsync(message);
        }

        public async Task AddNoteAsync(TicketNote note)
        {
            await _context.TicketNotes.AddAsync(note);
        }

        public async Task AddStatusHistoryAsync(TicketStatusHistory history)
        {
            await _context.TicketStatusHistories.AddAsync(history);
        }

        public async Task<TicketMessage?> GetMessageByIdAsync(int messageId)
        {
            return await _context.TicketMessages.FindAsync(messageId);
        }

        public async Task<List<AppUser>> GetAllAgentsAsync()
        {
            return await _context.Users
                .Where(u => ((AppUser)u).Role == UserRole.Agent)
                .Cast<AppUser>()
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}