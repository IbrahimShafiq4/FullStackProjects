namespace VibeVaultAPI.Models
{
    public enum MediaType
    {
        Image = 1,
        Video = 2
    }

    public enum VibeTag
    {
        Cozy = 1,
        Chaotic = 2,
        Nostalgic = 3,
        Futuristic = 4,
        Calm = 5,
        MindBlown = 6
    }

    public class VibeItem
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string MediaUrl { get; set; } = string.Empty;

        public MediaType MediaType { get; set; }

        public VibeTag Tag { get; set; }

        public DateTime CapturedAt { get; set; } = DateTime.UtcNow;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string AppUserId { get; set; } = string.Empty;

        public AppUser AppUser { get; set; } = null!;
    }
}