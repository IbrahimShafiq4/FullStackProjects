namespace TalentBridgeAPI.Models
{
    public class CandidateSkill
    {
        public int              Id                  { get; set; }
        public string           SkillName           { get; set; } = string.Empty;
        public int              CandidateProfileId  { get; set; }
        public CandidateProfile CandidateProfile    { get; set; } = null!;
    }
}
