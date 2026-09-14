namespace ShelfLife.Domain.Entities
{
    public class ChallengeParticipation
    {
        public int Id { get; set; }
        public int ChallengeId { get; set; }
        public Challenge Challenge { get; set; } = null!;
        public string AppUserId { get; set; } = string.Empty;
        public AppUser AppUser { get; set; } = null!;
        public string PhotoUrl { get; set; } = string.Empty;
        public string Caption { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public int? Rank { get; set; }
    }
}