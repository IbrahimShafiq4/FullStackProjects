using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShelfLife.Application.DTOs;
using ShelfLife.Domain.Entities;
using ShelfLife.Infrastructure.Data;
using ShelfLife.Infrastructure.Services;
using System.Security.Claims;

namespace ShelfLife.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RecipeVideosController : ControllerBase
    {
        private readonly AppDbContext           _context;
        private readonly IMediaStorageService   _mediaStorage;

        public RecipeVideosController(AppDbContext context, IMediaStorageService mediaStorage)
        { _context = context; _mediaStorage = mediaStorage; }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<ActionResult<List<RecipeVideoDto>>> GetMyVideos()
        {
            var userId = GetCurrentUserId();

            var videos = await _context.RecipeVideos
                                        .Include(v => v.UsedProducts)
                                        .Where(v => v.AppUserId == userId)
                                        .ToListAsync();

            var dtos = videos.Select(v => new RecipeVideoDto
            {
                Id = v.Id,
                Title = v.Title,
                VideoUrl = v.VideoUrl,
                UsedProductNames = v.UsedProducts.Select(p => p.Name).ToList()
            }).ToList();

            return Ok(dtos);
        }

        [HttpPost]
        public async Task<ActionResult> CreateVideo([FromForm] string title, [FromForm] List<int> productsId, IFormFile file)
        {
            string videoUrl;
            try
            {
                videoUrl = await _mediaStorage.SaveAsync(file, MediaKind.Video);
            }
            catch(InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }

            var userId = GetCurrentUserId();

            var products = await _context.Products.Where(p => productsId.Contains(p.Id) && p.AppUserId == userId)
                                                  .ToListAsync();

            var receipeVideo = new RecipeVideo
            {
                Title = title,
                VideoUrl = videoUrl,
                AppUserId = userId,
                UsedProducts = products,
            };

            _context.RecipeVideos.Add(receipeVideo);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم إضافة الفيديو" });
        }
    }
}
