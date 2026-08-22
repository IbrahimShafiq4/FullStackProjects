using AutoMapper;
using VideoPlatformApi.Api.DTOs;
using VideoPlatformApi.Api.Repositories.UserRepo;
using VideoPlatformApi.Api.Repositories.VideoRepo;
using VideoPlatformApi.Models;
using VideoPlatformApi.Repositories;

namespace VideoPlatformApi.Api.Services.CommentServiceControl
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IVideoRepository _videoRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public CommentService(
            ICommentRepository commentRepository,
            IVideoRepository videoRepository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _commentRepository = commentRepository;
            _videoRepository = videoRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CommentDto>> GetCommentsByVideoIdAsync(int videoId)
        {
            var comments = await _commentRepository.GetByVideoIdAsync(videoId);
            return _mapper.Map<IEnumerable<CommentDto>>(comments);
        }

        public async Task<CommentDto> AddCommentAsync(CreateCommentDto createDto)
        {
            if (!await _videoRepository.ExistsAsync(createDto.VideoId))
                throw new KeyNotFoundException($"الفيديو بـ ID {createDto.VideoId} غير موجود");

            if (!await _userRepository.ExistsAsync(createDto.UserId))
                throw new KeyNotFoundException($"المستخدم بـ ID {createDto.UserId} غير موجود");

            var comment = new Comment
            {
                Content = createDto.Content,
                VideoId = createDto.VideoId,
                UserId = createDto.UserId,
                CreatedAt = DateTime.UtcNow
            };

            await _commentRepository.AddAsync(comment);
            await _commentRepository.SaveChangesAsync();

            return _mapper.Map<CommentDto>(comment);
        }

        public async Task DeleteCommentAsync(int id)
        {
            var comment = await _commentRepository.GetByIdAsync(id);
            if (comment == null)
                throw new KeyNotFoundException($"التعليق بـ ID {id} غير موجود");

            await _commentRepository.DeleteAsync(id);
            await _commentRepository.SaveChangesAsync();
        }
    }
}
