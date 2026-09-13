namespace LedgerFlow.API.DTOs
{
    public class GeneralStatsDto
    {
        public int      TotalUsers { get; set; }
        public int      TotalTransactions { get; set; }
        public decimal  TotalRevenue { get; set; }
        public decimal  TotalExpenses { get; set; }
    }
}