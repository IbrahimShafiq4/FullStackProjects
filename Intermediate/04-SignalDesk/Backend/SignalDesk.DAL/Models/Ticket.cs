using SignalDesk.DAL.Models.Enums;

namespace SignalDesk.DAL.Models
{
    public class Ticket
    {
        public int Id                       { get; set; }
        public string Subject               { get; set; } = string.Empty;
        public TicketStatus Status          { get; set; } = TicketStatus.Open;
        public TicketPriority Priority      { get; set; }
        public DateTime CreatedAt           { get; set; } = DateTime.UtcNow;

        public DateTime SlaDeadline         { get; set; }

        public string CustomerId            { get; set; } = string.Empty;
        public AppUser Customer             { get; set; } = null!;

        public string? AssignedAgentId      { get; set; }
        public AppUser? AssignedAgent       { get; set; }

        public List<TicketMessage> Messages { get; set; } = new();
    }
}
