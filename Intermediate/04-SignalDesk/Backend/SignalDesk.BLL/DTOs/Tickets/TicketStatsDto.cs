namespace SignalDesk.BLL.DTOs.Tickets
{
    public class TicketStatsDto
    {
        public int Total { get; set; }
        public int Open { get; set; }
        public int InProgress { get; set; }
        public int Resolved { get; set; }
        public int Closed { get; set; }
        public int Overdue { get; set; }
        public int NearingDeadline { get; set; }
        public int Unassigned { get; set; }
        public int AssignedToMe { get; set; }
        public double AvgResolutionHours { get; set; }
        public double SlaComplianceRate { get; set; }
        public List<DailyCountDto> LastSevenDays { get; set; } = new();
        public List<CategoryCountDto> ByCategory { get; set; } = new();
        public List<PriorityCountDto> ByPriority { get; set; } = new();
    }

    public class DailyCountDto
    {
        public string Date { get; set; } = string.Empty;
        public int Created { get; set; }
        public int Resolved { get; set; }
    }

    public class CategoryCountDto
    {
        public string Category { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class PriorityCountDto
    {
        public string Priority { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}