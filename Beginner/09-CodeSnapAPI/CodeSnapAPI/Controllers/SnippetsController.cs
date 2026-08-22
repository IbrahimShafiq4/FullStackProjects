using AutoMapper;
using CodeSnapAPI.Data;
using CodeSnapAPI.DTOs.Snippets;
using CodeSnapAPI.Models;
using CodeSnapAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System.Security.Claims;

namespace CodeSnapAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SnippetsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IFileStorageService _fileStorage;

        public SnippetsController(AppDbContext context, IMapper mapper, IFileStorageService fileStorage)
        { _context = context; _mapper = mapper; _fileStorage = fileStorage; }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SnippetDto>>> GetMySnippets([FromQuery] string? language, [FromQuery] string? search)
        {
            var userId = GetCurrentUserId();
            var query = _context.Snippes.Where(s => s.AppUserId == userId);

            if (!string.IsNullOrWhiteSpace(language) && Enum.TryParse<ProgrammingLanguage>(language, true, out var parsedLanguage))
            {
                query = query.Where(e => e.Language == parsedLanguage);
            }

            if (!string.IsNullOrWhiteSpace(search)) { query = query.Where(s => s.Title.Contains(search)); }

            var snippets = await query.OrderByDescending(s => s.CreatedAt).ToListAsync();

            return Ok(_mapper.Map<List<SnippetDto>>(snippets));
        }

        [HttpPost]
        public async Task<ActionResult<SnippetDto>> CreateSnippet([FromForm] CreateSnippetDto dto, IFormFile? screenshot)
        {
            if (!Enum.TryParse<ProgrammingLanguage>(dto.Language, true, out var language))
            {
                return BadRequest("لغة البرمجة غير مدعومة");
            }

            string? screenshotUrl = null;

            if (screenshot is not null && screenshot.Length > 0)
            {
                try
                {
                    var (url, _) = await _fileStorage.SaveMediaAsync(screenshot);
                    screenshotUrl = url;
                }
                catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
            }

            var snippet = new Snippet
            {
                Title = dto.Title,
                Code = dto.Code,
                Language = language,
                ScreenshotUrl = screenshotUrl,
                AppUserId = GetCurrentUserId(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Snippes.Add(snippet);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<SnippetDto>(snippet));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SnippetDto>> UpdateSnippet(
            int id,
            [FromForm] CreateSnippetDto dto,
            IFormFile? screenshot)
        {
            if (!Enum.TryParse<ProgrammingLanguage>(
                dto.Language,
                true,
                out var language))
            {
                return BadRequest("لغة البرمجة دى مش مدعومة");
            }

            var userId = GetCurrentUserId();

            var snippet = await _context.Snippes
                .FirstOrDefaultAsync(s => s.Id == id);

            if (snippet is null)
                return NotFound("الـ snippet مش موجودة");

            if (snippet.AppUserId != userId)
                return Forbid();

            snippet.Title = dto.Title;
            snippet.Code = dto.Code;
            snippet.Language = language;

            if (screenshot is not null && screenshot.Length > 0)
            {
                try
                {
                    _fileStorage.DeleteFile(snippet.ScreenshotUrl);

                    var (url, _) =
                        await _fileStorage.SaveMediaAsync(screenshot);

                    snippet.ScreenshotUrl = url;
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<SnippetDto>(snippet));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSnippet(int id)
        {
            var snippet = await _context.Snippes.FindAsync(id);
            if (snippet is null) { return NotFound(); }

            if (snippet.AppUserId != GetCurrentUserId()) { return Forbid(); }

            _fileStorage.DeleteFile(snippet.ScreenshotUrl);

            _context.Snippes.Remove(snippet);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"تم حذف العنصر {snippet.Title}" });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SnippetDto>> GetSnippet(int id)
        {
            var snippet = await _context.Snippes.FindAsync(id);
            if (snippet is null) { return NotFound(); }

            if (snippet.AppUserId != GetCurrentUserId()) { return Forbid(); }

            return Ok(_mapper.Map<SnippetDto>(snippet));
        }

    }
}
