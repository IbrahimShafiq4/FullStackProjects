namespace ShelfLife.Application.DTOs
{
    public class ChallengeDto
    {
        public int      Id          { get; set; }
        public string   Title       { get; set; } = string.Empty;
        public string   Description { get; set; } = string.Empty;
        public string   Reward      { get; set; } = string.Empty;
        public int      Days        { get; set; }
        public int      Target      { get; set; }
        public bool     IsActive    { get; set; }
        public DateTime CreatedAt   { get; set; }
    }

    public class CreateChallengeDto
    {
        public string   Title       { get; set; } = string.Empty;
        public string   Description { get; set; } = string.Empty;
        public string   Reward      { get; set; } = string.Empty;
        public int      Days        { get; set; } = 5;
        public int      Target      { get; set; } = 5;
    }

    public class UpdateChallengeDto
    {
        public string   Title       { get; set; } = string.Empty;
        public string   Description { get; set; } = string.Empty;
        public string   Reward      { get; set; } = string.Empty;
        public int      Days        { get; set; }
        public int      Target      { get; set; }
        public bool     IsActive    { get; set; }
    }
}