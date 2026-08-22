namespace VibeVaultAPI.DTOs.Vibes
{
    public class VibeItemDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string MediaUrl { get; set; } = string.Empty;

        public string MediaType { get; set; } = string.Empty;

        public string Tag { get; set; } = string.Empty;

        public string TagEmoji { get; set; } = string.Empty;

        public DateTime CapturedAt { get; set; }
    }
}