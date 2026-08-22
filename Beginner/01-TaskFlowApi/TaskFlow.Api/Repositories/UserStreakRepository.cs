using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;

namespace TaskFlow.Api.Repositories
{
    public class UserStreakRepository : IUserStreakRepository
    {
        private readonly AppDbContext _context;

        public UserStreakRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Models.UserStreak?> GetByIdAsync(int id) =>
            await _context.UserStreaks.FindAsync(id);

        public async Task<bool> HasPendingTasksAsync(int userStreakId) =>
            await _context.TaskItems.AnyAsync(u => u.UserStreakId == userStreakId && !u.IsCompleted);

        public async Task<bool> ExistsAsync(int id) =>
            await _context.UserStreaks.AnyAsync(u => u.Id == id);

        public async Task SaveChangesAsync() =>
            await _context.SaveChangesAsync();
    }
}