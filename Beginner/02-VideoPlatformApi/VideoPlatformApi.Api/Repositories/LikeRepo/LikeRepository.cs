using Microsoft.EntityFrameworkCore;
using VideoPlatformApi.Api.Data;
using VideoPlatformApi.Models;

namespace VideoPlatformApi.Api.Repositories.LikeRepo
{
    public class LikeRepository: ILikeRepository
    {
        private readonly AppDbContext   _context;
        private readonly DbSet<Like>    _dbSet;

        public LikeRepository(AppDbContext context)
        { _context = context; _dbSet = _context.Set<Like>(); }

        public async Task<IEnumerable<Like>> GetByVideoIdAsync(int videoId) =>
            await _dbSet.Include(l => l.User)
                        .Where(l => l.VideoId == videoId)
                        .ToListAsync();

        public async Task<Like?> GetByIdAsync(int id) =>
            await _dbSet.Include(l => l.User)
                        .Include(l => l.Video)
                        .FirstOrDefaultAsync(l => l.Id == id);

        public async Task<Like?> GetByUserAndVideoAsync(int userId, int videoId) =>
            await _dbSet.FirstOrDefaultAsync(l => l.UserId == userId && l.VideoId == videoId);

        public async Task AddAsync(Like like) =>
            await _dbSet.AddAsync(like);

        public async Task<bool> ExistsAsync(int userId, int videoId) =>
            await _dbSet.AnyAsync(l => l.UserId == userId && l.VideoId == videoId);

        public async Task DeleteAsync(int id) 
        {
            var like = await _dbSet.FindAsync(id);
            if (like is not null) { _dbSet.Remove(like); }
        }

        public async Task<int> GetLikeCountAsync(int videoId) =>
            await _dbSet.CountAsync(l => l.VideoId == videoId);

        public async Task<bool> UserLikedVideoAsync(int userId, int videoId) =>
             await _context.Likes
                .AnyAsync(l => l.UserId == userId && l.VideoId == videoId);

        public async Task SaveChangesAsync() =>
            await _context.SaveChangesAsync();
    }
}
