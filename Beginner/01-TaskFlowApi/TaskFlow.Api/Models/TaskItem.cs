namespace TaskFlow.Api.Models
{
    public class TaskItem
    {
        public int Id                   { get; set; }
        public string Title             { get; set; } = string.Empty;
        public bool IsCompleted         { get; set; } = false;
        public DateTime CreatedAt       { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt    { get; set; }

        public int UserStreakId         { get; set; }
        public UserStreak? UserStreak   { get; set; }
    }
}
