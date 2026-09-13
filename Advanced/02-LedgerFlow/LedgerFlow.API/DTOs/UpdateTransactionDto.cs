namespace LedgerFlow.API.DTOs
{
    public class UpdateTransactionDto
    {
        public int?         CategoryId { get; set; }
        public decimal?     Amount { get; set; }
        public string?      Description { get; set; }
        public DateTime?    OccurredAt { get; set; }
    }
}
