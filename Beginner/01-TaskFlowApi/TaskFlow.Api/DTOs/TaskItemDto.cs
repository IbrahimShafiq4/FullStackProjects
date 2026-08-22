namespace TaskFlow.Api.DTOs
{
    public class TaskItemDto
    {
        public int Id               { get; set; }
        public string Title         { get; set; } = string.Empty;
        public bool IsCompleted     { get; set; }
        public DateTime CreatedAt   { get; set; }
    }
}
