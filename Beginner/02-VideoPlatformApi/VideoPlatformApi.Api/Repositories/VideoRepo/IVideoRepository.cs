using VideoPlatformApi.Api.Models;

namespace VideoPlatformApi.Api.Repositories.VideoRepo
{
    public interface IVideoRepository
    {
        Task<IEnumerable<Video>> GetAllAsync();
        Task<Video?> GetByIdAsync(int id);
        Task<IEnumerable<Video>> GetByCategoryAsync(string category);
        Task<IEnumerable<Video>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Video>> SearchAsync(string searchTerm);
        Task<IEnumerable<Video>> GetMostViewedAsync(int count);
        Task<IEnumerable<Video>> GetRecentAsync(int count);
        Task AddAsync(Video video);
        Task UpdateAsync(Video video);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task IncrementViewsAsync(int videoId);
        Task<int> GetCommentCountAsync(int videoId);
        Task<int> GetLikeCountAsync(int videoId);
        Task SaveChangesAsync();
    }
}
