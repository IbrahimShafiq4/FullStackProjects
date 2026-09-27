using SignalDesk.DAL.Models.Enums;

namespace SignalDesk.BLL.DTOs.Tickets
{
    public class TicketFilterDto
    {
        public string? Search { get; set; }
        public TicketStatus? Status { get; set; }
        public TicketPriority? Priority { get; set; }
        public TicketCategory? Category { get; set; }
        public string? AssignedAgentId { get; set; }
        public bool? AssignedToMe { get; set; }
        public bool? Unassigned { get; set; }
        public bool? Overdue { get; set; }
        public string? SortBy { get; set; } = "created";
        public string? SortDir { get; set; } = "desc";
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}