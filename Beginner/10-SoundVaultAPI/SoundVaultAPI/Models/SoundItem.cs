namespace SoundVaultAPI.Models
{
    public class SoundItem
    {
        public int              Id              { get; set; }
        public string           Title           { get; set; } = string.Empty;
        public string?          Description     { get; set; }

        public string           MediaUrl        { get; set; } = string.Empty;
        public MediaType        MediaType       { get; set; }

        public SoundCategory    Category        { get; set; }

        public DateTime         CapturedAt      { get; set; } = DateTime.UtcNow;
        public DateTime         CreatedAT       { get; set; } = DateTime.UtcNow;

        public string           AppUserId       { get; set; } = string.Empty;
        public AppUser          AppUser         { get; set; } = null!;
    }
}
