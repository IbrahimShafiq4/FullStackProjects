using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using VideoPlatformApi.Api.DTOs;
using VideoPlatformApi.Api.Hubs;
using VideoPlatformApi.Api.Services.LIkeServiceControl;
using VideoPlatformApi.Api.Services.VideoServiceControl;

namespace VideoPlatformApi.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VideosController : ControllerBase
    {
        private readonly IVideoService          _videoService;
        private readonly ILikeService           _likeService;
        private readonly IHubContext<VideoHub>  _hubContext;

        public VideosController
        (
            IVideoService videoService, 
            ILikeService likeService, 
            IHubContext<VideoHub> hubContext
        )
        { _videoService = videoService; _likeService = likeService; _hubContext = hubContext; }

        // GET: api/videos
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var videos = await _videoService.GetAllVideosAsync();
            return Ok(new { Status = "success", Data = videos, Count = videos.Count() });
        }

        // GET: api/videos/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var video = await _videoService.GetVideoByIdAsync(id);
            if (video is null)
                return NotFound(new { Status = "error", Message = $"الفيديو بـ Id {id} غير موجود" });

            return Ok(new { Status = "Success", Data = video });
        }

        // GET: api/videos/category/{category}
        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetByCategory(string category)
        {
            var videos = await _videoService.GetVideosByCategoryAsync(category);
            return Ok(new
            {
                Status = "success",
                Data = videos,
                Count = videos.Count()
            });
        }

        // ==========================================
        // GET: api/videos/user/{userId}
        // ==========================================
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var videos = await _videoService.GetVideosByUserAsync(userId);
            return Ok(new
            {
                Status = "success",
                Data = videos,
                Count = videos.Count()
            });
        }

        // ==========================================
        // GET: api/videos/search?q={term}
        // ==========================================
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest(new { Status = "error", Message = "مصطلح البحث مطلوب" });

            var videos = await _videoService.SearchVideosAsync(q);
            return Ok(new
            {
                Status = "success",
                Data = videos,
                Count = videos.Count()
            });
        }

        // ==========================================
        // GET: api/videos/most-viewed?count=10
        // ==========================================
        [HttpGet("most-viewed")]
        public async Task<IActionResult> GetMostViewed([FromQuery] int count = 10)
        {
            var videos = await _videoService.GetMostViewedVideosAsync(count);
            return Ok(new
            {
                Status = "success",
                Data = videos,
                Count = videos.Count()
            });
        }

        // ==========================================
        // GET: api/videos/recent?count=10
        // ==========================================
        [HttpGet("recent")]
        public async Task<IActionResult> GetRecent([FromQuery] int count = 10)
        {
            var videos = await _videoService.GetRecentVideosAsync(count);
            return Ok(new
            {
                Status = "success",
                Data = videos,
                Count = videos.Count()
            });
        }

        // ==========================================
        // POST: api/videos
        // ==========================================
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateVideoDto createDto)
        {
            try
            {
                var video = await _videoService.CreateVideoAsync(createDto);

                // SignalR: إشعار بفيديو جديد
                await _hubContext.Clients.All.SendAsync("NewVideoUploaded", new
                {
                    VideoId = video.Id,
                    Title = video.Title,
                    Username = "مستخدم", // هنعدل ده بعد Authentication
                    Timestamp = DateTime.UtcNow
                });

                return CreatedAtAction(nameof(GetById), new { id = video.Id }, new
                {
                    Status = "success",
                    Message = "تم رفع الفيديو بنجاح",
                    Data = video
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Status = "error", Message = ex.Message });
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
        // PUT: api/videos/{id}
        // ==========================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateVideoDto updateDto)
        {
            try
            {
                var video = await _videoService.UpdateVideoAsync(id, updateDto);
                return Ok(new
                {
                    Status = "success",
                    Message = "تم تحديث الفيديو بنجاح",
                    Data = video
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
        // DELETE: api/videos/{id}
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _videoService.DeleteVideoAsync(id);
                return Ok(new
                {
                    Status = "success",
                    Message = $"تم حذف الفيديو بـ ID {id} بنجاح"
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
        // PATCH: api/videos/{id}/view
        // ==========================================
        [HttpPatch("{id}/view")]
        public async Task<IActionResult> IncrementViews(int id)
        {
            try
            {
                if (!await _videoService.VideoExistsAsync(id))
                    return NotFound(new { Status = "error", Message = $"الفيديو بـ ID {id} غير موجود" });

                await _videoService.IncrementViewsAsync(id);

                // نجيب عدد المشاهدات الجديد
                var video = await _videoService.GetVideoByIdAsync(id);

                // SignalR: تحديث المشاهدات في الوقت الفعلي
                await _hubContext.Clients.Group($"video-{id}").SendAsync("ViewsUpdated", new
                {
                    VideoId = id,
                    Views = video?.Views ?? 0
                });

                return Ok(new
                {
                    Status = "success",
                    Message = "تم زيادة المشاهدات",
                    Views = video?.Views ?? 0
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
        // POST: api/videos/{id}/like?userId={userId}
        // ==========================================
        [HttpPost("{id}/like")]
        public async Task<IActionResult> ToggleLike(int id, [FromQuery] int userId)
        {
            try
            {
                var likeCount = await _likeService.ToggleLikeAsync(id, userId);
                var userLiked = await _likeService.UserLikedVideoAsync(id, userId);

                // SignalR: إشعار بتغيير الإعجابات
                await _hubContext.Clients.All.SendAsync("LikesUpdated", new
                {
                    VideoId = id,
                    Likes = likeCount,
                    UserLiked = userLiked
                });

                return Ok(new
                {
                    Status = "success",
                    Likes = likeCount,
                    UserLiked = userLiked
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
        // GET: api/videos/{id}/like-status?userId={userId}
        // ==========================================
        [HttpGet("{id}/like-status")]
        public async Task<IActionResult> GetLikeStatus(int id, [FromQuery] int userId)
        {
            try
            {
                var userLiked = await _likeService.UserLikedVideoAsync(id, userId);
                var likeCount = await _likeService.GetLikeCountAsync(id);

                return Ok(new
                {
                    Status = "success",
                    VideoId = id,
                    Likes = likeCount,
                    UserLiked = userLiked
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Status = "error", Message = ex.Message });
            }
        }
    }
}
