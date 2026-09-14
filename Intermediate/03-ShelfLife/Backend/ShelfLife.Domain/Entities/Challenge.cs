namespace ShelfLife.Domain.Entities
{
    public class Challenge
    {
        public int      Id          { get; set; }
        public string   Title       { get; set; } = string.Empty;
        public string   Description { get; set; } = string.Empty;
        public string   Reward      { get; set; } = string.Empty;
        public int      Days        { get; set; } = 5;
        public int      Target      { get; set; } = 5;
        public bool     IsActive    { get; set; } = true;
        public DateTime CreatedAt   { get; set; } = DateTime.UtcNow;
    }
}