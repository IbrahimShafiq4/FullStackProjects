namespace SoundVaultAPI.DTOs.Sounds
{
    public class SoundItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string MediaUrl { get; set; } = string.Empty;
        public string MediaType { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string CategoryEmoji { get; set; } = string.Empty;
        public DateTime CapturedAt { get; set; }
        public int LikeCount { get; set; }
        public int CommentCount { get; set; }
        public bool IsLiked { get; set; }
    }
}