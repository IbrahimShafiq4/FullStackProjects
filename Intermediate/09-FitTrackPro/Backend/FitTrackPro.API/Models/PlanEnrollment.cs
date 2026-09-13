namespace FitTrackPro.API.Models
{
    public class PlanEnrollment
    {
        public int          Id              { get; set; }
        public DateTime     EnrolledAt      { get; set; } = DateTime.UtcNow;

        public int          WorkoutPlanId   { get; set; }
        public WorkoutPlan  WorkoutPlan     { get; set; } = null!;

        public string       TraineeId       { get; set; } = string.Empty;
        public AppUser      Trainee         { get; set; } = null!;
    }
}
