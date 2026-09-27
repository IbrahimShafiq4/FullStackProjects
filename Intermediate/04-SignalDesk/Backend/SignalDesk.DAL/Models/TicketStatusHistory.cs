using SignalDesk.DAL.Models.Enums;

namespace SignalDesk.DAL.Models
{
    public class TicketStatusHistory
    {
        public int Id { get; set; }
        public TicketStatus FromStatus { get; set; }
        public TicketStatus ToStatus { get; set; }
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
        public string ChangedById { get; set; } = string.Empty;
        public AppUser ChangedBy { get; set; } = null!;
        public int TicketId { get; set; }
        public Ticket Ticket { get; set; } = null!;
    }
}