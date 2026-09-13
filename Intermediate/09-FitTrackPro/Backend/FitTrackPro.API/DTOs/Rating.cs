namespace FitTrackPro.API.DTOs
{
    public class CoachRatingDto
    {
        public string CoachId       { get; set; } = string.Empty;
        public string CoachName     { get; set; } = string.Empty;
        public double AverageRating { get; set; }
        public int RatingCount      { get; set; }
    }

    public class AddRatingDto
    {
        public string   CoachId         { get; set; } = string.Empty;
        public int      Rating          { get; set; }
        public string?  Comment         { get; set; }
        public int?     WorkoutPlanId   { get; set; }
    }
}
