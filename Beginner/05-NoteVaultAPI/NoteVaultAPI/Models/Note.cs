namespace NoteVaultAPI.Models
{
    public class Note
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string AppUserId { get; set; } = string.Empty;
        public AppUser AppUser { get; set; } = null!;

    }
}
