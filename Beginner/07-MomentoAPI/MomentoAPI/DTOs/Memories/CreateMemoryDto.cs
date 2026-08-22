namespace MomentoAPI.DTOs.Memories
{
    public class CreateMemoryDto
    {
        public string   Title       { get; set; } = string.Empty;
        public string?  Description { get; set; } = string.Empty;
        public DateTime MemoryDate  { get; set; }
    }
}
