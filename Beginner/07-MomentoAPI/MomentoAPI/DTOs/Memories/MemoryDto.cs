namespace MomentoAPI.DTOs.Memories
{
    public class MemoryDto
    {
        public int Id               { get; set; }
        public string Title         { get; set; } = string.Empty;
        public string? Description  { get; set; } = string.Empty;

        public string MediaUrl      { get; set; } = string.Empty;
        public string MediaType     { get; set; } = string.Empty;
        public DateTime MemoryDate  { get; set; }
    }
}
