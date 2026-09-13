using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoundVaultAPI.Data;
using SoundVaultAPI.DTOs.Sounds;
using SoundVaultAPI.Models;
using SoundVaultAPI.Services;
using System.Security.Claims;

namespace SoundVaultAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SoundsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IFileStorageService _fileStorage;

        public SoundsController(AppDbContext context, IMapper mapper, IFileStorageService fileStorage)
        {
            _context = context;
            _mapper = mapper;
            _fileStorage = fileStorage;
        }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SoundItemDto>>> GetMySounds([FromQuery] string? category, [FromQuery] string? search)
        {
            var userId = GetCurrentUserId();
            var query = _context.Sounds
                .Include(s => s.Likes)
                .Include(s => s.Comments)
                .Where(s => s.AppUserId == userId);

            if (!string.IsNullOrWhiteSpace(category) && Enum.TryParse<SoundCategory>(category, true, out var parsedCategory))
                query = query.Where(s => s.Category == parsedCategory);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(s => s.Title.Contains(search) || (s.Description != null && s.Description.Contains(search)));

            var sounds = await query.OrderByDescending(s => s.CapturedAt).ToListAsync();
            var dtos = _mapper.Map<List<SoundItemDto>>(sounds);

            foreach (var dto in dtos)
            {
                var sound = sounds.First(s => s.Id == dto.Id);
                dto.LikeCount = sound.Likes.Count;
                dto.CommentCount = sound.Comments.Count;
                dto.IsLiked = sound.Likes.Any(l => l.UserId == userId);
            }

            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SoundItemDto>> GetSoundById(int id)
        {
            var userId = GetCurrentUserId();
            var sound = await _context.Sounds
                .Include(s => s.Likes)
                .Include(s => s.Comments)
                .FirstOrDefaultAsync(s => s.Id == id && s.AppUserId == userId);

            if (sound == null)
                return NotFound();

            var dto = _mapper.Map<SoundItemDto>(sound);
            dto.LikeCount = sound.Likes.Count;
            dto.CommentCount = sound.Comments.Count;
            dto.IsLiked = sound.Likes.Any(l => l.UserId == userId);

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<SoundItemDto>> CreateSound([FromForm] CreateSoundDto dto, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("يجب رفع ملف (صورة، صوت، أو فيديو)");

            if (!Enum.TryParse<SoundCategory>(dto.Category, true, out var category))
                return BadRequest("التصنيف غير صالح. القيم: Calm, Laughter, Music, Nature, Scream, Speech, Other");

            string mediaUrl;
            MediaType mediaType;
            try
            {
                (mediaUrl, mediaType) = await _fileStorage.SaveMediaAsync(file);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }

            var sound = new SoundItem
            {
                Title = dto.Title,
                Description = dto.Description,
                CapturedAt = dto.CapturedAt.ToUniversalTime(),
                Category = category,
                MediaUrl = mediaUrl,
                MediaType = mediaType,
                AppUserId = GetCurrentUserId(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Sounds.Add(sound);
            await _context.SaveChangesAsync();

            var dtoResult = _mapper.Map<SoundItemDto>(sound);
            dtoResult.LikeCount = 0;
            dtoResult.CommentCount = 0;
            dtoResult.IsLiked = false;

            return Ok(dtoResult);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSound(int id, [FromForm] CreateSoundDto dto, IFormFile? file)
        {
            var userId = GetCurrentUserId();
            var sound = await _context.Sounds.FirstOrDefaultAsync(s => s.Id == id && s.AppUserId == userId);

            if (sound == null)
                return NotFound();

            if (!Enum.TryParse<SoundCategory>(dto.Category, true, out var category))
                return BadRequest("التصنيف غير صالح.");

            sound.Title = dto.Title;
            sound.Description = dto.Description;
            sound.CapturedAt = dto.CapturedAt.ToUniversalTime();
            sound.Category = category;

            if (file != null && file.Length > 0)
            {
                try
                {
                    var (newUrl, newType) = await _fileStorage.SaveMediaAsync(file);
                    sound.MediaUrl = newUrl;
                    sound.MediaType = newType;
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            await _context.SaveChangesAsync();

            var dtoResult = _mapper.Map<SoundItemDto>(sound);
            var likes = await _context.Likes.CountAsync(l => l.SoundId == id);
            var comments = await _context.Comments.CountAsync(c => c.SoundId == id);
            var isLiked = await _context.Likes.AnyAsync(l => l.SoundId == id && l.UserId == userId);
            dtoResult.LikeCount = likes;
            dtoResult.CommentCount = comments;
            dtoResult.IsLiked = isLiked;

            return Ok(dtoResult);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSound(int id)
        {
            var userId = GetCurrentUserId();
            var sound = await _context.Sounds.FirstOrDefaultAsync(s => s.Id == id && s.AppUserId == userId);

            if (sound == null)
                return NotFound();

            _context.Sounds.Remove(sound);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"تم مسح الملف {sound.Title}" });
        }

        [HttpGet("{id}/comments")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(int id)
        {
            var userId = GetCurrentUserId();
            var sound = await _context.Sounds.FirstOrDefaultAsync(s => s.Id == id && s.AppUserId == userId);
            if (sound == null)
                return NotFound();

            var comments = await _context.Comments
                .Where(c => c.SoundId == id)
                .Include(c => c.User)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    UserName = c.User.FullName,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            return Ok(comments);
        }

        [HttpPost("{id}/comments")]
        public async Task<ActionResult<CommentDto>> AddComment(
           int id,
           [FromBody] CreateCommentDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest("التعليق لا يمكن أن يكون فارغاً");

            var userId = GetCurrentUserId();

            var sound = await _context.Sounds
                .FirstOrDefaultAsync(s => s.Id == id && s.AppUserId == userId);

            if (sound == null)
                return NotFound();

            var comment = new Comment
            {
                Content = dto.Content,
                SoundId = id,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);

            return Ok(new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                UserName = user?.FullName ?? "مستخدم",
                CreatedAt = comment.CreatedAt
            });
        }

        [HttpDelete("comments/{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            var userId = GetCurrentUserId();
            var comment = await _context.Comments
                .Include(c => c.Sound)
                .FirstOrDefaultAsync(c => c.Id == commentId && c.UserId == userId);

            if (comment == null)
                return NotFound();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم حذف التعليق" });
        }

        [HttpPost("{id}/like")]
        public async Task<IActionResult> ToggleLike(int id)
        {
            var userId = GetCurrentUserId();
            var sound = await _context.Sounds.FirstOrDefaultAsync(s => s.Id == id && s.AppUserId == userId);
            if (sound == null)
                return NotFound();

            var existingLike = await _context.Likes.FirstOrDefaultAsync(l => l.SoundId == id && l.UserId == userId);
            if (existingLike != null)
            {
                _context.Likes.Remove(existingLike);
                await _context.SaveChangesAsync();
                return Ok(new { liked = false });
            }
            else
            {
                _context.Likes.Add(new Like { SoundId = id, UserId = userId });
                await _context.SaveChangesAsync();
                return Ok(new { liked = true });
            }
        }
    }

    public class CommentDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}