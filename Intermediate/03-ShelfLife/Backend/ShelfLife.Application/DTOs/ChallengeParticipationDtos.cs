namespace ShelfLife.Application.DTOs
{
    public class ChallengeParticipationDto
    {
        public int      Id              { get; set; }
        public int      ChallengeId     { get; set; }
        public string   ChallengeTitle  { get; set; } = string.Empty;
        public string   UserId          { get; set; } = string.Empty;
        public string   UserName        { get; set; } = string.Empty;
        public string   PhotoUrl        { get; set; } = string.Empty;
        public string   Caption         { get; set; } = string.Empty;
        public DateTime SubmittedAt     { get; set; }
        public int?     Rank            { get; set; }
    }

    public class CreateParticipationDto
    {
        public int      ChallengeId { get; set; }
        public string   Caption     { get; set; } = string.Empty;
    }

    public class SetRankDto
    {
        public int? Rank { get; set; }
    }
}