namespace LedgerFlow.API.Models
{
    public class Transaction
    {
        public int      Id          { get; set; }
        public decimal  Amount      { get; set; }
        public string   Description { get; set; } = string.Empty;
        public DateTime OccurredAt  { get; set; } = DateTime.UtcNow;

        public int      CategoryId  { get; set; }
        public Category Category    { get; set; } = null!;

        public string   OwnerId     { get; set; } = string.Empty;
    }
}
