namespace TaskFlow.Api.DTOs
{
    public class CreateTaskItemDto
    {
        public string Title         { get; set; } = string.Empty;
        public int UserStreakId     { get; set; }
    }
}
