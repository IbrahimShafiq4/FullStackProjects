namespace SignalDesk.BLL.DTOs.Tickets
{
    public class TicketDto
    {
        public int Id { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime SlaDeadline { get; set; }
        public bool IsOverdue { get; set; }
        public bool IsNearingDeadline { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string? AssignedAgentName { get; set; }
    }
}
