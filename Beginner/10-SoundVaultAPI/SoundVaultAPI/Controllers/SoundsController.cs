using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoundVaultAPI.Data;
using SoundVaultAPI.DTOs.Sounds;
using SoundVaultAPI.Models;
using SoundVaultAPI.Services;
using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace SoundVaultAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SoundsController : ControllerBase
    {
        private readonly AppDbContext           _context;
        private readonly IMapper                _mapper;
        private readonly IFileStorageService    _fileStorage;
        private readonly DbSet<SoundItem>       _dbSet;

        public SoundsController(AppDbContext context, IMapper mapper, IFileStorageService fileStorage)
        { _context = context; _mapper = mapper; _fileStorage = fileStorage; _dbSet = _context.Set<SoundItem>(); }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SoundItemDto>>> GetMySounds([FromQuery] string? category, [FromQuery] string? search)
        {
            var userId = GetCurrentUserId();

            var query = _dbSet.Where(s => s.AppUserId == userId);

            if(!string.IsNullOrWhiteSpace(category) && Enum.TryParse<SoundCategory>(category, true, out var parsedCategory))
            {
                query = query.Where(s => s.Category == parsedCategory);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(s => s.Title.ToLower().Trim().Contains(search.ToLower().Trim()) || (s.Description != null && s.Description.ToLower().Trim().Contains(search.ToLower().Trim())));
            }

            var sounds = await query.OrderByDescending(s => s.CapturedAt).ToListAsync();

            return Ok(_mapper.Map<List<SoundItemDto>>(sounds));
        }

        [HttpPost]    
        public async Task<ActionResult<SoundItemDto>> CreateSound([FromForm] CreateSoundDto dto, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("يجب رفع ملف (صورة، صوت، أو فيديو)");
            }

            if (!Enum.TryParse<SoundCategory>(dto.Category, true, out var category))
                return BadRequest("التصنيف غير صالح. القيم: Calm, Laughter, Music, Nature, Scream, Speech, Other");

            string mediaUrl;
            MediaType mediaType;

            try
            {
                (mediaUrl, mediaType) = await _fileStorage.SaveMediaAsync(file);
            }
            catch(InvalidOperationException ex) { return BadRequest(ex.Message); }

            var sound = new SoundItem
            {
                Title       = dto.Title,
                Description = dto.Description,
                CapturedAt  = dto.CapturedAt.ToUniversalTime(),
                Category    = category,
                MediaUrl    = mediaUrl,
                MediaType   = mediaType,
                AppUserId   = GetCurrentUserId(),
                CreatedAT   = DateTime.UtcNow
            };

            _dbSet.Add(sound);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<SoundItem>(sound));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSound(int id)
        {
            var sound = await _context.Sounds.FindAsync(id);

            if (sound is null) return NotFound();

            if (sound.AppUserId != GetCurrentUserId())
                return Forbid();

            _dbSet.Remove(sound);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"تم مسح الملف {sound.Title}" });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SoundItemDto>> GetSoundById(int id)
        {
            var userId = GetCurrentUserId();
            var sound = await _context.Sounds
                .FirstOrDefaultAsync(s => s.Id == id && s.AppUserId == userId);

            if (sound == null)
                return NotFound();

            return Ok(_mapper.Map<SoundItemDto>(sound));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSound(int id, [FromForm] CreateSoundDto dto, IFormFile? file)
        {
            var userId = GetCurrentUserId();
            var sound = await _context.Sounds
                .FirstOrDefaultAsync(s => s.Id == id && s.AppUserId == userId);

            if (sound == null)
                return NotFound();

            if (!Enum.TryParse<SoundCategory>(dto.Category, true, out var category))
                return BadRequest("التصنيف غير صالح.");

            sound.Title         = dto.Title;
            sound.Description   = dto.Description;
            sound.CapturedAt    = dto.CapturedAt.ToUniversalTime();
            sound.Category      = category;

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
            return Ok(_mapper.Map<SoundItemDto>(sound));
        }
    }
}
