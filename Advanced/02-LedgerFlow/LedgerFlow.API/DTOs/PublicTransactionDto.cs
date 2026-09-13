namespace LedgerFlow.API.DTOs
{
    public class PublicTransactionDto
    {
        public int      Id { get; set; }
        public decimal  Amount { get; set; }
        public string   Description { get; set; } = string.Empty;
        public string   CategoryName { get; set; } = string.Empty;
        public DateTime OccurredAt { get; set; }
    }
}