namespace FitTrackPro.API.Models
{
    public class WorkoutPlan
    {
        public int                  Id          { get; set; }
        public string               Title       { get; set; } = string.Empty;
        public string               Description { get; set; } = string.Empty;
        public DateTime             CreatedAt   { get; set; } = DateTime.UtcNow;

        public string               CoachId     { get; set; } = string.Empty;
        public AppUser              Coach       { get; set; } = null!;

        public List<Exercise>       Exercises   { get; set; } = new();
        public List<PlanEnrollment> Enrollments { get; set; } = new();
    }
}
