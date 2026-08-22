using VideoPlatformApi.Api.DTOs;

namespace VideoPlatformApi.Api.Services.VideoServiceControl
{
    public interface IVideoService
    {
        Task<IEnumerable<VideoDto>> GetAllVideosAsync();
        Task<VideoDto?> GetVideoByIdAsync(int id);
        Task<IEnumerable<VideoDto>> GetVideosByCategoryAsync(string category);
        Task<IEnumerable<VideoDto>> GetVideosByUserAsync(int userId);
        Task<IEnumerable<VideoDto>> SearchVideosAsync(string searchTerm);
        Task<IEnumerable<VideoDto>> GetMostViewedVideosAsync(int count);
        Task<IEnumerable<VideoDto>> GetRecentVideosAsync(int count);
        Task<VideoDto> CreateVideoAsync(CreateVideoDto createDto);
        Task<VideoDto> UpdateVideoAsync(int id, UpdateVideoDto updateDto);
        Task DeleteVideoAsync(int id);
        Task IncrementViewsAsync(int id);
        Task<bool> VideoExistsAsync(int id);
        Task<VideoDetailDto> GetVideoDetailAsync(int id);
    }
}