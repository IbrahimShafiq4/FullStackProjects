namespace MomentoAPI.Models
{
    public enum MediaType
    {
        Image = 1,
        Video = 2
    }

    public class Memory
    {
        public int          Id          { get; set; }
        public string       Title       { get; set; } = string.Empty;
        public string?      Description { get; set; } = string.Empty;
        // ----------------------------------------------------------------------
        public string       MediaUrl    { get; set; } = string.Empty;
        public MediaType    MediaType   { get; set; }
        
        // ----------------------------------------------------------------------
        public DateTime     MemoryDate  { get; set; } = DateTime.UtcNow.Date;
        public DateTime     CreatedAt   { get; set; } = DateTime.UtcNow;

        // ----------------------------------------------------------------------
        public string       AppUserId   { get; set; } = string.Empty;
        public AppUser      AppUser     { get; set; } = null!;
    }
}
