namespace VibeVaultAPI.DTOs.Vibes
{
    public class CreateVibeDto
    {
        public string   Title       { get; set; } = string.Empty;
        public string?  Description { get; set; }
        public DateTime CapturedAt  { get; set; }
        public string   Tag         { get; set; } = string.Empty;
    }
}
