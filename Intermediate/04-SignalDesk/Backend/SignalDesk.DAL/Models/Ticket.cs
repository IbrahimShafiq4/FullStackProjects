using SignalDesk.DAL.Models.Enums;

namespace SignalDesk.DAL.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TicketStatus Status { get; set; } = TicketStatus.Open;
        public TicketPriority Priority { get; set; }
        public TicketCategory Category { get; set; } = TicketCategory.Technical;
        public string? Tags { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public DateTime SlaDeadline { get; set; }

        public string CustomerId { get; set; } = string.Empty;
        public AppUser Customer { get; set; } = null!;

        public string? AssignedAgentId { get; set; }
        public AppUser? AssignedAgent { get; set; }

        public List<TicketMessage> Messages { get; set; } = new();
        public List<TicketNote> Notes { get; set; } = new();
        public List<TicketStatusHistory> StatusHistory { get; set; } = new();
    }
}