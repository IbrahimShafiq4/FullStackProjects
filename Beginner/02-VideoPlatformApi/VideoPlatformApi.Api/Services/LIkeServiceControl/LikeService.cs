using VideoPlatformApi.Api.Repositories.LikeRepo;
using VideoPlatformApi.Api.Repositories.UserRepo;
using VideoPlatformApi.Api.Repositories.VideoRepo;
using VideoPlatformApi.Models;

namespace VideoPlatformApi.Api.Services.LIkeServiceControl
{
    public class LikeService : ILikeService
    {
        private readonly ILikeRepository _likeRepository;
        private readonly IVideoRepository _videoRepository;
        private readonly IUserRepository _userRepository;

        public LikeService(
            ILikeRepository likeRepository,
            IVideoRepository videoRepository,
            IUserRepository userRepository)
        {
            _likeRepository = likeRepository;
            _videoRepository = videoRepository;
            _userRepository = userRepository;
        }

        public async Task<int> ToggleLikeAsync(int videoId, int userId)
        {
            // 1. نتأكد من وجود الفيديو
            if (!await _videoRepository.ExistsAsync(videoId))
                throw new KeyNotFoundException($"الفيديو بـ ID {videoId} غير موجود");

            // 2. نتأكد من وجود المستخدم
            if (!await _userRepository.ExistsAsync(userId))
                throw new KeyNotFoundException($"المستخدم بـ ID {userId} غير موجود");

            // 3. نشوف إذا كان المستخدم معمول Like قبل كده
            var existingLike = await _likeRepository.GetByUserAndVideoAsync(userId, videoId);

            if (existingLike != null)
            {
                // لو عامل Like قبل كده، نشيله (Unlike)
                await _likeRepository.DeleteAsync(existingLike.Id);
                await _likeRepository.SaveChangesAsync();

                // نرجع العدد الجديد
                return await _likeRepository.GetLikeCountAsync(videoId);
            }
            else
            {
                // لو معملش Like، نضيفه
                var like = new Like
                {
                    VideoId = videoId,
                    UserId = userId,
                    LikedAt = DateTime.UtcNow
                };

                await _likeRepository.AddAsync(like);
                await _likeRepository.SaveChangesAsync();

                // نرجع العدد الجديد
                return await _likeRepository.GetLikeCountAsync(videoId);
            }
        }

        public async Task<bool> UserLikedVideoAsync(int videoId, int userId)
        {
            return await _likeRepository.UserLikedVideoAsync(userId, videoId);
        }

        public async Task<int> GetLikeCountAsync(int videoId)
        {
            return await _likeRepository.GetLikeCountAsync(videoId);
        }
    }
}
