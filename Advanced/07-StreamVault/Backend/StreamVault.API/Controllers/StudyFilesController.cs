using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamVault.Application.Features;
using StreamVault.Application.Interfaces;
using StreamVault.Domain.Domain;
using StreamVault.Domain.Entities;
using System.Security.Claims;

namespace StreamVault.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StudyFilesController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly IWebHostEnvironment _env;

        private static readonly string[] AllowedExtensions = { ".pdf", ".docx", ".pptx", ".png", ".jpg", ".jpeg" };
        private const long MaxFileSizeBytes = 50 * 1024 * 1024;

        public StudyFilesController(IAppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();

        [HttpPost]
        [Authorize(Roles = "Instructor")]
        [RequestSizeLimit(MaxFileSizeBytes)]
        public async Task<IActionResult> Upload(
            [FromForm] CreateStudyFileDto dto,
            IFormFile file,
            CancellationToken cancellationToken)
        {
            if (file is null || file.Length == 0)
                return BadRequest(new { message = "يجب اختيار ملف" });

            if (file.Length > MaxFileSizeBytes)
                return BadRequest(new { message = "حجم الملف أكبر من الحد المسموح (٥٠ ميجا)" });

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
                return BadRequest(new { message = "نوع الملف غير مدعوم" });

            var course = await _context.Courses
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == dto.CourseId && c.InstructorId == CurrentUserId, cancellationToken);

            if (course is null)
                return NotFound(new { message = "الكورس غير موجود أو لا تملكه" });

            var fileName = $"{Guid.NewGuid():N}{extension}";
            var folder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "files");
            Directory.CreateDirectory(folder);
            var fullPath = Path.Combine(folder, fileName);

            await using (var stream = new FileStream(fullPath, FileMode.CreateNew, FileAccess.Write, FileShare.None))
            {
                await file.CopyToAsync(stream, cancellationToken);
            }

            var studyFile = new StudyFile
            {
                Title = dto.Title,
                Description = dto.Description,
                FilePath = fullPath,
                OriginalFileName = file.FileName,
                ContentType = file.ContentType,
                FileSizeBytes = file.Length,
                CourseId = dto.CourseId,
                TeacherId = CurrentUserId,
                Price = dto.IsFree ? 0 : dto.Price,
                IsFree = dto.IsFree
            };

            _context.StudyFiles.Add(studyFile);
            await _context.SaveChangesAsync(cancellationToken);

            return StatusCode(StatusCodes.Status201Created, new { studyFile.Id });
        }

        [HttpGet("course/{courseId:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<StudyFileDto>>> ListByCourse(int courseId, CancellationToken cancellationToken)
        {
            var files = await _context.StudyFiles
                .AsNoTracking()
                .Where(s => s.CourseId == courseId)
                .OrderByDescending(s => s.CreatedAt)
                .Select(s => new StudyFileDto(
                    s.Id, s.Title, s.Description, s.OriginalFileName, s.ContentType,
                    s.FileSizeBytes, s.Price, s.IsFree, s.CourseId,
                    s.Course.Title, s.Teacher.FullName, s.CreatedAt))
                .ToListAsync(cancellationToken);

            return Ok(files);
        }

        [HttpGet("{id:int}/download")]
        [AllowAnonymous]
        public async Task<IActionResult> Download(int id, CancellationToken cancellationToken)
        {
            var file = await _context.StudyFiles
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

            if (file is null)
                return NotFound(new { message = "الملف غير موجود" });

            if (!file.IsFree)
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "يجب شراء هذا الملف أولاً" });

                var isOwner = file.TeacherId == userId;

                var purchased = await _context.Payments
                    .AsNoTracking()
                    .AnyAsync(p => p.StudentId == userId
                                && p.StudyFileId == id
                                && p.Status == PaymentStatus.Succeeded, cancellationToken);

                if (!isOwner && !purchased)
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "يجب شراء هذا الملف أولاً" });
            }

            if (!System.IO.File.Exists(file.FilePath))
                return NotFound(new { message = "الملف غير موجود على السيرفر" });

            var bytes = await System.IO.File.ReadAllBytesAsync(file.FilePath, cancellationToken);

            Response.Headers.Append("Content-Disposition", $"inline; filename=\"{file.OriginalFileName}\"");
            Response.Headers.Append("Access-Control-Allow-Origin", "https://localhost:4200");
            Response.Headers.Append("Access-Control-Allow-Credentials", "true");

            return File(bytes, file.ContentType);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var file = await _context.StudyFiles
                .FirstOrDefaultAsync(s => s.Id == id && s.TeacherId == CurrentUserId, cancellationToken);

            if (file is null)
                return NotFound(new { message = "الملف غير موجود" });

            if (System.IO.File.Exists(file.FilePath))
                System.IO.File.Delete(file.FilePath);

            _context.StudyFiles.Remove(file);
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { message = "تم حذف الملف بنجاح" });
        }
    }
}