using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using VibeVaultAPI.Data;
using VibeVaultAPI.DTOs.Vibes;
using VibeVaultAPI.Models;
using VibeVaultAPI.Services;

namespace VibeVaultAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VibesController : Controller
    {
        private readonly AppDbContext               _context;
        private readonly IMapper                    _mapper;
        private readonly IFileStorageService        _fileService;
        private DbSet<VibeItem>                     _dbset;

        public VibesController(AppDbContext context, IMapper mapper, IFileStorageService fileService)
        { _context = context; _mapper = mapper; _fileService = fileService; _dbset = _context.Set<VibeItem>(); }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VibeItemDto>>> GetMyVibes([FromQuery] string? tag = null)
        {
            var userId = GetCurrentUserId();
            var query = _dbset.Where(v => v.AppUserId == userId);

            if (!string.IsNullOrEmpty(tag))
            {
                if (Enum.TryParse<VibeTag>(tag, true, out var parsedTag))
                {
                    query = query.Where(v => v.Tag == parsedTag);
                }
                else
                {
                    return BadRequest($"Tag '{tag}' غير صالح. القيم المسموحة: Cozy, Chaotic, Nostalgic, Futuristic, Calm, MindBlown");
                }
            }

            var vibes = await query.OrderByDescending(v => v.CapturedAt)
                                   .ToListAsync();

            return Ok(_mapper.Map<List<VibeItemDto>>(vibes));
        }

        [HttpPost]
        public async Task<ActionResult<VibeItemDto>> CreateVibe([FromForm] CreateVibeDto dto, IFormFile file)
        {
            if (file == null || file.Length == 0)
                BadRequest("لازم ترفع صورة أو فيديو مع الــ Vibe.");

            if(!Enum.TryParse<VibeTag>(dto.Tag, true, out var vibeTag))
                return BadRequest("Tag غير صالح. القيم المسموحة: Cozy, Chaotic, Nostalgic, Futuristic, Calm, MindBlown");

            string mediaUrl;
            MediaType mediaType;

            try
            {
                (mediaUrl, mediaType) = await _fileService.SaveMediaAsync(file);
            }
            catch (InvalidOperationException ex) { return BadRequest(ex.Message); }

            var vibe = new VibeItem
            {
                Title = dto.Title,
                Description = dto.Description,
                CapturedAt = dto.CapturedAt.ToUniversalTime(),
                Tag = vibeTag,
                MediaUrl = mediaUrl,
                MediaType = mediaType,
                AppUserId = GetCurrentUserId(),
                CreatedAt = DateTime.UtcNow
            };

            _dbset.Add(vibe);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<VibeItemDto>(vibe));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVibe(int id)
        {
            var vibe = await _context.Vibes.FindAsync(id);
            if (vibe == null) return NotFound();

            if (vibe.AppUserId != GetCurrentUserId())
            {
                return Forbid();
            }

            _context.Vibes.Remove(vibe);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
