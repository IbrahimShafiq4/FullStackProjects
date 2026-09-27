using SignalDesk.DAL.Models;
using SignalDesk.DAL.Models.Enums;
using SignalDesk.DAL.Models.Tickets;

namespace SignalDesk.DAL.Repositories
{
    public interface ITicketRepository
    {
        Task<List<Ticket>> GetAllForUserAsync(string userId, UserRole role);
        Task<(List<Ticket> Items, int Total)> GetFilteredAsync(string userId, UserRole role, TicketFilter filter);
        Task<Ticket?> GetByIdWithMessagesAsync(int id);
        Task<Ticket?> GetByIdWithDetailsAsync(int id);
        Task<Ticket?> GetByIdAsync(int id);
        Task AddTicketAsync(Ticket ticket);
        Task AddMessageAsync(TicketMessage message);
        Task AddNoteAsync(TicketNote note);
        Task AddStatusHistoryAsync(TicketStatusHistory history);
        Task<TicketMessage?> GetMessageByIdAsync(int messageId);
        Task<List<AppUser>> GetAllAgentsAsync();
        Task<List<Ticket>> GetAllForStatsAsync(string userId, UserRole role);
        Task SaveChangesAsync();
    }
}