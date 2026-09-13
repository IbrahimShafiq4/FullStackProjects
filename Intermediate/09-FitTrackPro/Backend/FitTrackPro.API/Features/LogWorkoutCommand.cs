using FitTrackPro.API.Data;
using FitTrackPro.API.Mediator;
using FitTrackPro.API.Models;

namespace FitTrackPro.API.Features
{
    public record LogWorkoutCommand(string TraineeId, int ExerciseId, int Reps, decimal Weight) : IRequest<bool>;

    public class LogWorkoutHandler : IRequestHandler<LogWorkoutCommand, bool>
    {
        private readonly AppDbContext _context;
        public LogWorkoutHandler(AppDbContext context)
        { _context = context; }

        public async Task<bool> HandleAsync(LogWorkoutCommand request)
        {
            var log = new WorkoutLog
            {
                TraineeId = request.TraineeId,
                ExerciseId = request.ExerciseId,
                Reps = request.Reps,
                Weight = request.Weight,
                LoggedAt = DateTime.UtcNow
            };

            _context.WorkoutLogs.Add(log);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
