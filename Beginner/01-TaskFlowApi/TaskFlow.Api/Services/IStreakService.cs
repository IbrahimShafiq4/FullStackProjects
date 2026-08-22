namespace TaskFlow.Api.Services
{
    public interface IStreakService
    {
        Task UpdateStreakIfAllTasksCompletedAsync(int userStreakId);
    }
}