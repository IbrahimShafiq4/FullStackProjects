namespace TalentBridgeAPI.Models
{
    public class Job
    {
        public int                          Id              { get; set; }
        public string                       Title           { get; set; } = string.Empty;
        public string                       Description     { get; set; } = string.Empty;
        public string                       EmployerId      { get; set; } = string.Empty;
        public AppUser                      Employer        { get; set; } = null!;
        public List<JobSkillRequirement>    RequiredSkills  { get; set; } = new();
        public List<Application>            Applications    { get; set; } = new();
    }
}
