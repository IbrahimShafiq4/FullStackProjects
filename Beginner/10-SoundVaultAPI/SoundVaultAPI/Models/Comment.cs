namespace SoundVaultAPI.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string UserId { get; set; } = string.Empty;
        public AppUser User { get; set; } = null!;

        public int SoundId { get; set; }
        public SoundItem Sound { get; set; } = null!;
    }
}
