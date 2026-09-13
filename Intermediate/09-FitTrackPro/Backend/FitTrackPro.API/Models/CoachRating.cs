namespace FitTrackPro.API.Models
{
    public class CoachRating
    {
        public int          Id              { get; set; }
        public int          Rating          { get; set; }
        public string       Comment         { get; set; } = string.Empty;
        public DateTime     RatedAt         { get; set; } = DateTime.UtcNow;

        public string       TraineeId       { get; set; } = string.Empty;
        public AppUser      Trainee         { get; set; } = null!;

        public string       CoachId         { get; set; } = string.Empty;
        public AppUser      Coach           { get; set; } = null!;

        public int?         WorkoutPlanId   { get; set; }
    }
}
