using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MomentoAPI.Data;
using MomentoAPI.DTOs.Memories;
using MomentoAPI.Models;
using MomentoAPI.Services;
using System.Security.Claims;

namespace MomentoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MemoriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IFileStorageService _fileStorage;
        private readonly DbSet<Memory> _dbSet;

        public MemoriesController(
            AppDbContext context,
            IMapper mapper,
            IFileStorageService fileStorageService)
        {
            _context = context;
            _mapper = mapper;
            _fileStorage = fileStorageService;
            _dbSet = _context.Set<Memory>();
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemoryDto>>> GetMyMemories()
        {
            var userId = GetCurrentUserId();

            var memories = await _dbSet
                .Where(m => m.AppUserId == userId)
                .OrderByDescending(m => m.MemoryDate)
                .ToListAsync();

            return Ok(_mapper.Map<List<MemoryDto>>(memories));
        }

        [HttpPost]
        public async Task<ActionResult<MemoryDto>> CreateMemory(
            [FromForm] CreateMemoryDto dto,
            IFormFile file)
        {
            if (file is null || file.Length == 0)
                return BadRequest("لازم ترفع صورة او فيديو مع الذكرى");

            string mediaUrl = string.Empty;
            MediaType mediaType = Models.MediaType.Image;

            try
            {
                (mediaUrl, mediaType) =
                    await _fileStorage.SaveMediaAsync(file);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }

            var memory = new Memory
            {
                Title = dto.Title,
                Description = dto.Description,
                MemoryDate = dto.MemoryDate.Date,
                MediaUrl = mediaUrl,
                MediaType = mediaType,
                AppUserId = GetCurrentUserId(),
                CreatedAt = DateTime.UtcNow
            };

            await _dbSet.AddAsync(memory);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<MemoryDto>(memory));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMemory(int id)
        {
            var memory = await _dbSet.FindAsync(id);


            if (memory is null)
                return NotFound();

            if (memory.AppUserId != GetCurrentUserId())
                return Forbid();

            _dbSet.Remove(memory);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"الذكرى {memory.Title} اتمسحت"
            });
        }
    }
}
