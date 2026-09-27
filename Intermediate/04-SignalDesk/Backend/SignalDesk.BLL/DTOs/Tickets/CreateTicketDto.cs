using SignalDesk.DAL.Models.Enums;

namespace SignalDesk.BLL.DTOs.Tickets
{
    public class CreateTicketDto
    {
        public string Subject { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TicketPriority Priority { get; set; }
        public TicketCategory Category { get; set; } = TicketCategory.Technical;
        public string? Tags { get; set; }
    }
}