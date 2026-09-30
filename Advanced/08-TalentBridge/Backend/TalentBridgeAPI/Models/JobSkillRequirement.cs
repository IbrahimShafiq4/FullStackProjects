namespace TalentBridgeAPI.Models
{
    public enum SkillImportance { MustHave = 1, NiceToHave = 2 }
    public class JobSkillRequirement
    {
        public int              Id          { get; set; }
        public string           SkillName   { get; set; } = string.Empty;
        public SkillImportance  Importance  { get; set; }
        public int              JobId       { get; set; }
        public Job              Job         { get; set; } = null!;
    }
}
