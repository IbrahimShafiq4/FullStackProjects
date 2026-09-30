namespace TalentBridgeAPI.Models
{
    public enum ApplicationStatus { Pending = 1, Reviewd = 2, Rejected = 3, Accepted = 4 }

    public class Application
    {
        public int                  Id          { get; set; }
        public double               MatchScore  { get; set; }
        public ApplicationStatus    Status      { get; set; } = ApplicationStatus.Pending;
        public int                  JobId       { get; set; }
        public Job                  Job         { get; set; } = null!;
        public string               CandidateId { get; set; } = string.Empty;
        public DateTime             AppliedAt   { get; set; } = DateTime.UtcNow;
    }
}
