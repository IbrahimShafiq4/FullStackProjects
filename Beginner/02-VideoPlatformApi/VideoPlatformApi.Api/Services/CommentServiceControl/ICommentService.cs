using VideoPlatformApi.Api.DTOs;

namespace VideoPlatformApi.Api.Services.CommentServiceControl
{
    public interface ICommentService
    {
        Task<IEnumerable<CommentDto>> GetCommentsByVideoIdAsync(int videoId);
        Task<CommentDto> AddCommentAsync(CreateCommentDto createDto);
        Task DeleteCommentAsync(int id);
    }
}
