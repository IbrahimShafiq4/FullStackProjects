using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System.Reflection.Metadata.Ecma335;
using VideoPlatformApi.Api.Data;
using VideoPlatformApi.Api.Models;

namespace VideoPlatformApi.Api.Repositories.VideoRepo
{
    public class VideoRepository : IVideoRepository
    {
        private readonly AppDbContext _context;

        public VideoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Video>> GetAllAsync()
        {
            return await _context.Videos
                .Include(v => v.User)
                .Include(v => v.Comments)
                .Include(v => v.Likes)
                .OrderByDescending(v => v.UploadedAt)
                .ToListAsync();
        }

        public async Task<Video?> GetByIdAsync(int id)
        {
            return await _context.Videos
                .Include(v => v.User)
                .Include(v => v.Comments)
                    .ThenInclude(c => c.User)
                .Include(v => v.Likes)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<IEnumerable<Video>> GetByCategoryAsync(string category)
        {
            return await _context.Videos
                .Include(v => v.User)
                .Where(v => v.Category == category)
                .OrderByDescending(v => v.UploadedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Video>> GetByUserIdAsync(int userId)
        {
            return await _context.Videos
                .Include(v => v.User)
                .Where(v => v.UserId == userId)
                .OrderByDescending(v => v.UploadedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Video>> SearchAsync(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            return await _context.Videos
                .Include(v => v.User)
                .Where(v => v.Title.ToLower().Contains(searchTerm) ||
                           v.Description.ToLower().Contains(searchTerm))
                .OrderByDescending(v => v.UploadedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Video>> GetMostViewedAsync(int count)
        {
            return await _context.Videos
                .Include(v => v.User)
                .OrderByDescending(v => v.Views)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<Video>> GetRecentAsync(int count)
        {
            return await _context.Videos
                .Include(v => v.User)
                .OrderByDescending(v => v.UploadedAt)
                .Take(count)
                .ToListAsync();
        }

        public async Task AddAsync(Video video)
        {
            await _context.Videos.AddAsync(video);
        }

        public async Task UpdateAsync(Video video)
        {
            _context.Videos.Update(video);
            await Task.CompletedTask;
        }

        public async Task DeleteAsync(int id)
        {
            var video = await _context.Videos.FindAsync(id);
            if (video != null)
            {
                _context.Videos.Remove(video);
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Videos.AnyAsync(v => v.Id == id);
        }

        public async Task IncrementViewsAsync(int videoId)
        {
            var video = await _context.Videos.FindAsync(videoId);
            if (video != null)
            {
                video.Views++;
                _context.Videos.Update(video);
            }
        }

        public async Task<int> GetCommentCountAsync(int videoId)
        {
            return await _context.Comments.CountAsync(c => c.VideoId == videoId);
        }

        public async Task<int> GetLikeCountAsync(int videoId)
        {
            return await _context.Likes.CountAsync(l => l.VideoId == videoId);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
