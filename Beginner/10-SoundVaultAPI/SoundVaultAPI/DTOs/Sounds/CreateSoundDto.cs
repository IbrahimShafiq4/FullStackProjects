namespace SoundVaultAPI.DTOs.Sounds
{
    public class CreateSoundDto
    {
        public string   Title       { get; set; } = string.Empty;
        public string?  Description { get; set; }
        public DateTime CapturedAt  { get; set; }
        public string   Category    { get; set; } = string.Empty;
    }
}
