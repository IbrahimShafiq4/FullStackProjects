namespace TaskFlow.Api.Models
{
    public class UserStreak
    {
        public int Id                       { get; set; }
        public string UserName              { get; set; } = string.Empty;
        public int CurrentStreak            { get; set; } = 0;
        public int LongestStreak            { get; set; } = 0;
        public DateTime? LastCompletionDate { get; set; }
        public List<TaskItem> Tasks         { get; set; } = new();
    }
}
