namespace SignalDesk.BLL.DTOs.Tickets
{
    public class TicketDto
    {
        public int Id { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Tags { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public DateTime SlaDeadline { get; set; }
        public bool IsOverdue { get; set; }
        public bool IsNearingDeadline { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string? AssignedAgentId { get; set; }
        public string? AssignedAgentName { get; set; }
        public int MessageCount { get; set; }
        public int NoteCount { get; set; }
    }
}