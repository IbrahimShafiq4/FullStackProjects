using VideoPlatformApi.Models;

namespace VideoPlatformApi.Repositories
{
    public interface ICommentRepository
    {
        Task<IEnumerable<Comment>> GetByVideoIdAsync(int videoId);
        Task<Comment?> GetByIdAsync(int id);
        Task AddAsync(Comment comment);
        Task UpdateAsync(Comment comment);
        Task DeleteAsync(int id);
        Task SaveChangesAsync();
    }
}