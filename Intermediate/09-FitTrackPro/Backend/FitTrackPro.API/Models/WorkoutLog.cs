namespace FitTrackPro.API.Models
{
    public class WorkoutLog
    {
        public int      Id          { get; set; }
        public int      Reps        { get; set; }
        public decimal  Weight      { get; set; }
        public DateTime LoggedAt    { get; set; } = DateTime.UtcNow;
        public string?  VoiceNoteUrl{ get; set; }
        public int      ExerciseId  { get; set; }
        public Exercise Exercise    { get; set; } = null!;

        public string   TraineeId   { get; set; } = string.Empty;
        public AppUser  Trainee     { get; set; } = null!;
    }
}
