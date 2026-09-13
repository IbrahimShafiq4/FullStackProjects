namespace LedgerFlow.API.DTOs
{
    public class CreateCategoryDto { 
        public string Name { get; set; } = string.Empty; 
        public string Type { get; set; } = string.Empty; 
    }
    public class RecordTransactionDto { 
        public int      CategoryId  { get; set; } 
        public decimal  Amount      { get; set; } 
        public string   Description { get; set; } = string.Empty; 
    }
    public class CategoryDto { 
        public int      Id      { get; set; } 
        public string   Name    { get; set; } = string.Empty; 
        public string   Type    { get; set; } = string.Empty; 
    }
    public class TransactionDto { 
        public int      Id              { get; set; } 
        public decimal  Amount          { get; set; } 
        public string   Description     { get; set; } = string.Empty; 
        public string   CategoryName    { get; set; } = string.Empty; 
        public DateTime OccurredAt      { get; set; } 
    }
}
