namespace LedgerFlow.API.Models
{
    public enum CategoryType { Expense = 1, Revenue = 2 }

    public class Category
    {
        public int          Id      { get; set; }
        public string       Name    { get; set; } = string.Empty;
        public CategoryType Type    { get; set; }

        public string       OwnerId { get; set; } = string.Empty;
    }
}
