using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Identity.Client;
using VideoPlatformApi.Api.DTOs;
using VideoPlatformApi.Api.Models;
using VideoPlatformApi.Api.Repositories.LikeRepo;
using VideoPlatformApi.Api.Repositories.UserRepo;
using VideoPlatformApi.Api.Repositories.VideoRepo;
using VideoPlatformApi.Api.Services.FileServiceControl;
using VideoPlatformApi.Models;
using VideoPlatformApi.Repositories;

namespace VideoPlatformApi.Api.Services.VideoServiceControl
{
    public class VideoService : IVideoService
    {
        private readonly IVideoRepository _videoRepository;
        private readonly IUserRepository _userRepository;
        private readonly ICommentRepository _commentRepository;
        private readonly ILikeRepository _likeRepository;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public VideoService(
            IVideoRepository videoRepository,
            IUserRepository userRepository,
            ICommentRepository commentRepository,
            ILikeRepository likeRepository,
            IFileService fileService,
            IMapper mapper)
        {
            _videoRepository = videoRepository;
            _userRepository = userRepository;
            _commentRepository = commentRepository;
            _likeRepository = likeRepository;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<IEnumerable<VideoDto>> GetAllVideosAsync()
        {
            var videos = await _videoRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<VideoDto>>(videos);
        }

        public async Task<VideoDto?> GetVideoByIdAsync(int id)
        {
            var video = await _videoRepository.GetByIdAsync(id);
            if (video == null) return null;

            var dto = _mapper.Map<VideoDto>(video);
            dto.CommentCount = await _videoRepository.GetCommentCountAsync(id);
            dto.LikesCount = await _videoRepository.GetLikeCountAsync(id);
            return dto;
        }

        public async Task<VideoDetailDto> GetVideoDetailAsync(int id)
        {
            var video = await _videoRepository.GetByIdAsync(id);
            if (video == null) return null!;

            var dto = _mapper.Map<VideoDetailDto>(video);
            dto.CommentCount = await _videoRepository.GetCommentCountAsync(id);
            dto.LikeCount = await _videoRepository.GetLikeCountAsync(id);

            // نجيب التعليقات
            var comments = await _commentRepository.GetByVideoIdAsync(id);
            dto.Comments = _mapper.Map<IEnumerable<CommentDto>>(comments);

            return dto;
        }

        public async Task<IEnumerable<VideoDto>> GetVideosByCategoryAsync(string category)
        {
            var videos = await _videoRepository.GetByCategoryAsync(category);
            return _mapper.Map<IEnumerable<VideoDto>>(videos);
        }

        public async Task<IEnumerable<VideoDto>> GetVideosByUserAsync(int userId)
        {
            var videos = await _videoRepository.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<VideoDto>>(videos);
        }

        public async Task<IEnumerable<VideoDto>> SearchVideosAsync(string searchTerm)
        {
            var videos = await _videoRepository.SearchAsync(searchTerm);
            return _mapper.Map<IEnumerable<VideoDto>>(videos);
        }

        public async Task<IEnumerable<VideoDto>> GetMostViewedVideosAsync(int count)
        {
            var videos = await _videoRepository.GetMostViewedAsync(count);
            return _mapper.Map<IEnumerable<VideoDto>>(videos);
        }

        public async Task<IEnumerable<VideoDto>> GetRecentVideosAsync(int count)
        {
            var videos = await _videoRepository.GetRecentAsync(count);
            return _mapper.Map<IEnumerable<VideoDto>>(videos);
        }

        public async Task<VideoDto> CreateVideoAsync(CreateVideoDto createDto)
        {
            var user = await _userRepository.GetByIdAsync(createDto.UserId);
            if (user == null)
                throw new KeyNotFoundException($"المستخدم بـ ID {createDto.UserId} غير موجود");

            var videoUrl = await _fileService.SaveVideoAsync(createDto.VideoFile);

            string? thumbnailUrl = null;
            if (createDto.ThumbnailFile != null)
            {
                thumbnailUrl = await _fileService.SaveImageAsync(createDto.ThumbnailFile);
            }

            var video = new Video
            {
                Title = createDto.Title,
                Description = createDto.Description,
                Category = createDto.Category,
                VideoUrl = videoUrl,
                ThumbnailUrl = thumbnailUrl,
                UserId = createDto.UserId,
                UploadedAt = DateTime.UtcNow,
                Views = 0
            };

            await _videoRepository.AddAsync(video);
            await _videoRepository.SaveChangesAsync();

            return _mapper.Map<VideoDto>(video);
        }

        public async Task<VideoDto> UpdateVideoAsync(int id, UpdateVideoDto updateDto)
        {
            var video = await _videoRepository.GetByIdAsync(id);
            if (video == null)
                throw new KeyNotFoundException($"الفيديو بـ ID {id} غير موجود");

            video.Title = updateDto.Title;
            video.Description = updateDto.Description;
            video.Category = updateDto.Category;

            if (updateDto.VideoFile != null)
            {
                await _fileService.DeleteFileAsync(video.VideoUrl);
                video.VideoUrl = await _fileService.SaveVideoAsync(updateDto.VideoFile);
            }

            if (updateDto.ThumbnailFile != null)
            {
                if (!string.IsNullOrEmpty(video.ThumbnailUrl))
                    await _fileService.DeleteFileAsync(video.ThumbnailUrl);
                video.ThumbnailUrl = await _fileService.SaveImageAsync(updateDto.ThumbnailFile);
            }

            await _videoRepository.UpdateAsync(video);
            await _videoRepository.SaveChangesAsync();

            return _mapper.Map<VideoDto>(video);
        }

        public async Task DeleteVideoAsync(int id)
        {
            var video = await _videoRepository.GetByIdAsync(id);
            if (video == null)
                throw new KeyNotFoundException($"الفيديو بـ ID {id} غير موجود");

            await _fileService.DeleteFileAsync(video.VideoUrl);

            if (!string.IsNullOrEmpty(video.ThumbnailUrl))
                await _fileService.DeleteFileAsync(video.ThumbnailUrl);

            await _videoRepository.DeleteAsync(id);
            await _videoRepository.SaveChangesAsync();
        }

        public async Task IncrementViewsAsync(int id)
        {
            if (!await _videoRepository.ExistsAsync(id))
                throw new KeyNotFoundException($"الفيديو بـ ID {id} غير موجود");

            await _videoRepository.IncrementViewsAsync(id);
            await _videoRepository.SaveChangesAsync();
        }

        public async Task<bool> VideoExistsAsync(int id)
        {
            return await _videoRepository.ExistsAsync(id);
        }
    }

}