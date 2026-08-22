namespace TaskFlow.Api.Repositories
{
    public interface ITaskItemRepository
    {
        Task<IEnumerable<Models.TaskItem>> GetAllAsync();
        Task<Models.TaskItem?> GetByIdAsync(int id);
        Task AddAsync(Models.TaskItem task);
        Task SaveChangesAsync();
    }
}