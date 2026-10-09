namespace TalentBridgeAPI.Models
{
    public enum WorkMode { OnSite = 1, Hybrid = 2, Remote = 3 }

    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public WorkMode WorkMode { get; set; } = WorkMode.OnSite;
        public int? SalaryMin { get; set; }
        public int? SalaryMax { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string EmployerId { get; set; } = string.Empty;
        public AppUser Employer { get; set; } = null!;
        public List<JobSkillRequirement> RequiredSkills { get; set; } = new();
        public List<Application> Applications { get; set; } = new();
    }
}