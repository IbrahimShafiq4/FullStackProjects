namespace TaskFlow.Api.Repositories
{
    public interface IUserStreakRepository
    {
        Task<Models.UserStreak?> GetByIdAsync(int id);
        Task<bool> HasPendingTasksAsync(int userStreakId);
        Task<bool> ExistsAsync(int id);
        Task SaveChangesAsync();
    }
}