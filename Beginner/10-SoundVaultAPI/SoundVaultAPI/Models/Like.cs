namespace SoundVaultAPI.Models
{
    public class Like
    {
        public string UserId { get; set; } = string.Empty;
        public AppUser User { get; set; } = null!;

        public int SoundId { get; set; }
        public SoundItem Sound { get; set; } = null!;
    }
}