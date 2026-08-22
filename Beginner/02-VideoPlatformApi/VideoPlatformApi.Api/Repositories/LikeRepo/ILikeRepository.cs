using VideoPlatformApi.Models;

namespace VideoPlatformApi.Api.Repositories.LikeRepo
{
    public interface ILikeRepository
    {
        Task<IEnumerable<Like>>     GetByVideoIdAsync(int videoId);
        Task<Like?>                 GetByUserAndVideoAsync(int userId, int videoId);
        Task                        AddAsync(Like like);
        Task                        DeleteAsync(int id);
        Task<int>                   GetLikeCountAsync(int videoId);
        Task<bool>                  UserLikedVideoAsync(int userId, int videoId);
        Task                        SaveChangesAsync();
    }
}
