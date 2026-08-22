using TaskFlow.Api.Repositories;

namespace TaskFlow.Api.Services
{
    public class StreakService : IStreakService
    {
        private readonly IUserStreakRepository _userStreakRepository;

        public StreakService(IUserStreakRepository userStreakRepository)
        {
            _userStreakRepository = userStreakRepository;
        }

        public async Task UpdateStreakIfAllTasksCompletedAsync(int userStreakId)
        {
            // لو لسه فيه مهام معلقة، منعملش أي حاجة
            var hasPending = await _userStreakRepository.HasPendingTasksAsync(userStreakId);
            if (hasPending)
                return;

            var userStreak = await _userStreakRepository.GetByIdAsync(userStreakId);
            if (userStreak == null)
                return;

            var today = DateTime.UtcNow.Date;

            if (userStreak.LastCompletionDate?.Date == today)
                return;

            var yesterday = today.AddDays(-1);

            if (userStreak.LastCompletionDate?.Date == yesterday)
            {
                userStreak.CurrentStreak++;
            }
            else
            {
                userStreak.CurrentStreak = 1;
            }

            if (userStreak.CurrentStreak > userStreak.LongestStreak)
            {
                userStreak.LongestStreak = userStreak.CurrentStreak;
            }

            userStreak.LastCompletionDate = today;
            await _userStreakRepository.SaveChangesAsync();
        }
    }
}