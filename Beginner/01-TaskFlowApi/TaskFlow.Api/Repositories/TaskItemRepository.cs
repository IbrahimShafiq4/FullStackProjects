using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Repositories
{
    public class TaskItemRepository : ITaskItemRepository
    {
        private readonly AppDbContext _context;

        public TaskItemRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskItem>> GetAllAsync() =>
            await _context.TaskItems.ToListAsync();

        public async Task<TaskItem?> GetByIdAsync(int id) =>
            await _context.TaskItems.FindAsync(id);

        public async Task AddAsync(TaskItem task) =>
            await _context.TaskItems.AddAsync(task);

        public async Task SaveChangesAsync() =>
            await _context.SaveChangesAsync();
    }
}