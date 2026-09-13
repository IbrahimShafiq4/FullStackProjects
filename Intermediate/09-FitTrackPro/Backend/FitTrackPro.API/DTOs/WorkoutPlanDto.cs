namespace FitTrackPro.API.DTOs
{
    public class ExerciseDto
    {
        public int                  Id              { get; set; }
        public string               Name            { get; set; } = string.Empty;
        public int                  TargetSets      { get; set; }
        public int                  TargetReps      { get; set; }
        public string?              DemoVideoUrl    { get; set; }
    }

    public class WorkoutPlanDto
    {
        public int                  Id              { get; set; }
        public string               Title           { get; set; } = string.Empty;
        public string               Description     { get; set; } = string.Empty;
        public string               CoachName       { get; set; } = string.Empty;
        public string               CoachId         { get; set; } = string.Empty;
        public List<ExerciseDto>    Exercises       { get; set; } = new();
    }

    public class CreatePlanDto
    {
        public string               Title           { get; set; } = string.Empty;
        public string               Description     { get; set; } = string.Empty;
    }

    public class CreateExerciseDto
    {
        public string               Name            { get; set; } = string.Empty;
        public int                  TargetSets      { get; set; }
        public int                  TargetReps      { get; set; }
    }

    public class LogWorkoutDto
    {
        public int                  ExerciseId      { get; set; }
        public int                  Reps            { get; set; }
        public decimal              Weight          { get; set; }
    }
}
