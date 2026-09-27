using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamVault.Application.Features;
using StreamVault.Application.Interfaces;
using StreamVault.Domain.Domain;
using StreamVault.Infrastructure.Services;
using System.Security.Claims;

namespace StreamVault.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VideosController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IVideoStreamingService _streamingService;

        private static readonly string[] AllowedExtensions = { ".mp4", ".webm", ".mov", ".mkv" };
        private const long MaxFileSizeBytes = 2L * 1024 * 1024 * 1024;

        public VideosController(
            IAppDbContext context,
            IWebHostEnvironment env,
            IVideoStreamingService streamingService)
        {
            _context = context;
            _env = env;
            _streamingService = streamingService;
        }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();

        [HttpPost("course/{courseId:int}")]
        [Authorize(Roles = "Instructor")]
        [DisableRequestSizeLimit]
        [RequestFormLimits(MultipartBodyLengthLimit = MaxFileSizeBytes)]
        public async Task<IActionResult> UploadVideo(
            int courseId,
            [FromForm] CreateVideoDto dto,
            IFormFile file,
            CancellationToken cancellationToken)
        {
            if (file is null || file.Length == 0)
                return BadRequest(new { message = "يجب اختيار ملف فيديو" });

            if (file.Length > MaxFileSizeBytes)
                return BadRequest(new { message = "حجم الفيديو أكبر من الحد المسموح" });

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
                return BadRequest(new { message = "نوع الملف غير مدعوم. المسموح: mp4, webm, mov, mkv" });

            var course = await _context.Courses
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == courseId && c.InstructorId == CurrentUserId, cancellationToken);

            if (course is null)
                return NotFound(new { message = "الكورس غير موجود أو لا تملكه" });

            var fileName = $"{Guid.NewGuid():N}{extension}";
            var folder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "videos");

            Directory.CreateDirectory(folder);

            var fullPath = Path.Combine(folder, fileName);

            await using (var stream = new FileStream(fullPath, FileMode.CreateNew, FileAccess.Write, FileShare.None, 81920, true))
            {
                await file.CopyToAsync(stream, cancellationToken);
            }

            var video = new Video
            {
                CourseId = courseId,
                Title = dto.Title,
                Order = dto.Order,
                FilePath = fullPath
            };

            _context.Videos.Add(video);
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { video.Id });
        }

        [HttpGet("course/{courseId:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCourseVideos(int courseId, CancellationToken cancellationToken)
        {
            var videos = await _context.Videos
                .AsNoTracking()
                .Where(v => v.CourseId == courseId)
                .OrderBy(v => v.Order)
                .Select(v => new VideoDto(v.Id, v.Title, v.Order))
                .ToListAsync(cancellationToken);

            return Ok(videos);
        }

        [HttpGet("{streamId:int}/stream")]
        [AllowAnonymous]
        public async Task<IActionResult> StreamVideo(int streamId, CancellationToken cancellationToken)
        {
            var video = await _context.Videos
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.Id == streamId, cancellationToken);

            if (video is null)
                return NotFound(new { message = "الفيديو غير موجود" });

            if (!System.IO.File.Exists(video.FilePath))
                return NotFound(new { message = "الملف غير موجود على السيرفر" });

            var extension = Path.GetExtension(video.FilePath).ToLowerInvariant();
            var contentType = extension switch
            {
                ".mp4" => "video/mp4",
                ".webm" => "video/webm",
                ".mov" => "video/quicktime",
                ".mkv" => "video/x-matroska",
                _ => "video/mp4"
            };

            return _streamingService.GetVideoStream(video.FilePath, contentType);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> DeleteVideo(int id, CancellationToken cancellationToken)
        {
            var video = await _context.Videos
                .Include(v => v.Course)
                .FirstOrDefaultAsync(v => v.Id == id, cancellationToken);

            if (video is null)
                return NotFound(new { message = "الفيديو غير موجود" });

            if (video.Course.InstructorId != CurrentUserId)
                return Forbid();

            if (System.IO.File.Exists(video.FilePath))
                System.IO.File.Delete(video.FilePath);

            _context.Videos.Remove(video);
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { message = "تم حذف الفيديو" });
        }
    }
}