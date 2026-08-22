using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using VideoPlatformApi.Api.DTOs;
using VideoPlatformApi.Api.Hubs;
using VideoPlatformApi.Api.Services.CommentServiceControl;

namespace VideoPlatformApi.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly IHubContext<VideoHub> _hubContext;

        public CommentsController(ICommentService commentService, IHubContext<VideoHub> hubContext)
        {
            _commentService = commentService;
            _hubContext = hubContext;
        }

        // ==========================================
        // GET: api/comments/video/{videoId}
        // ==========================================
        [HttpGet("video/{videoId}")]
        public async Task<IActionResult> GetByVideoId(int videoId)
        {
            var comments = await _commentService.GetCommentsByVideoIdAsync(videoId);
            return Ok(new
            {
                Status = "success",
                Data = comments,
                Count = comments.Count()
            });
        }

        // ==========================================
        // POST: api/comments
        // ==========================================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCommentDto createDto)
        {
            try
            {
                var comment = await _commentService.AddCommentAsync(createDto);

                // SignalR: إشعار بتعليق جديد
                await _hubContext.Clients.Group($"video-{createDto.VideoId}").SendAsync("NewComment", new
                {
                    VideoId = createDto.VideoId,
                    Username = "مستخدم", // هنعدل ده بعد Authentication
                    Comment = createDto.Content,
                    Timestamp = DateTime.UtcNow
                });

                return CreatedAtAction(nameof(GetByVideoId), new { videoId = createDto.VideoId }, new
                {
                    Status = "success",
                    Message = "تم إضافة التعليق بنجاح",
                    Data = comment
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Status = "error", Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Status = "error", Message = ex.Message });
            }
        }

        // ==========================================
        // DELETE: api/comments/{id}
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _commentService.DeleteCommentAsync(id);
                return Ok(new
                {
                    Status = "success",
                    Message = $"تم حذف التعليق بـ ID {id} بنجاح"
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Status = "error", Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Status = "error", Message = ex.Message });
            }
        }
    }
}
