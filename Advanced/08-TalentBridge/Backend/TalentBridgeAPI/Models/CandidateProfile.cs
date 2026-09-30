namespace TalentBridgeAPI.Models
{
    public class CandidateProfile
    {
        public int                  Id      { get; set; }
        public string               Bio     { get; set; } = string.Empty;
        public string               UserId  { get; set; } = string.Empty;
        public List<CandidateSkill> Skills  { get; set; } = new();
    }
}
