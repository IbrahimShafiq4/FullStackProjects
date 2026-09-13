namespace FitTrackPro.API.Models
{
    public class Exercise
    {
        public int          Id              { get; set; }
        public string       Name            { get; set; } = string.Empty;
        public int          TargetSets      { get; set; }
        public int          TargetReps      { get; set; }
        public string?      DemoVideoUrl    { get; set; }

        public int          WorkoutPlanId   { get; set; }
        public WorkoutPlan  WorkoutPlan     { get; set; } = null!;
    }
}
