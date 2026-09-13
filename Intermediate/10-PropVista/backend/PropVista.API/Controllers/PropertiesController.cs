using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PropVista.API.Data;
using PropVista.API.DTOs;
using PropVista.API.Models;
using PropVista.API.Services;
using System.Security.Claims;

namespace PropVista.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PropertiesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMediaStorageService _mediaStorage;

        public PropertiesController(
            AppDbContext context,
            IMediaStorageService mediaStorage
        )
        {
            _context = context;
            _mediaStorage = mediaStorage;
        }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetProperties()
        {
            var properties = await _context.Properties
                .Include(p => p.Owner)
                .Include(p => p.Images)
                .Select(p => new PropertyDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Price = p.Price,
                    ListingType = p.ListingType.ToString(),
                    TourVideoUrl = p.TourVideoUrl,
                    OwnerName = p.Owner.FullName,
                    Images = p.Images.Select(i => new PropertyImageDto { Id = i.Id, IsCover = i.IsCover, Url = i.Url }).ToList()
                }).ToListAsync();

            return Ok(properties);
        }

        [HttpPost]
        [Authorize(Roles = "Owner")]
        public async Task<IActionResult> CreateProperty([FromBody] CreatePropertyDto dto)
        {
            if (!Enum.TryParse<ListingType>(dto.ListingType, true, out var listingType))
                return BadRequest(new { message = "نوع العرض غير صحيح." });

            var property = new Property
            {
                Title = dto.Title,
                Description = dto.Description,
                Price = dto.Price,
                ListingType = listingType,
                OwnerId = GetCurrentUserId()
            };

            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = property.Id
            });
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProperties([FromQuery] string term)
        {
            if (string.IsNullOrWhiteSpace(term))
                return Ok(new List<PropertyDto>());

            var properties = await _context.Properties
                .Include(p => p.Owner)
                .Include(p => p.Images)
                .Where(p => p.Title.Contains(term) || p.Description.Contains(term))
                .Select(p => new PropertyDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Price = p.Price,
                    ListingType = p.ListingType.ToString(),
                    TourVideoUrl = p.TourVideoUrl,
                    OwnerName = p.Owner.FullName,
                    Images = p.Images.Select(i => new PropertyImageDto { Id = i.Id, IsCover = i.IsCover, Url = i.Url }).ToList()
                }).ToListAsync();

            return Ok(properties);
        }

        [HttpPost("{propertyId}/images")]
        [Authorize(Roles = "Owner")]
        [RequestSizeLimit(500L * 1024 * 1024)]
        public async Task<IActionResult> UploadImages(int propertyId, List<IFormFile> files)
        {
            var property = await _context.Properties
                .FirstOrDefaultAsync(p => p.Id == propertyId);

            if (property is null)
                return NotFound(new { message = "العقار غير موجود." });

            if (property.OwnerId != GetCurrentUserId())
                return Forbid();

            if (files is null || files.Count == 0)
                return BadRequest(new { message = "لم يتم اختيار أي صور." });

            var hasImages = await _context.PropertyImages
                .AnyAsync(i => i.PropertyId == propertyId);

            foreach (var file in files)
            {
                try
                {
                    var url = await _mediaStorage.SaveAsync(file, MediaKind.Image);

                    var image = new PropertyImage
                    {
                        PropertyId = property.Id,
                        Url = url,
                        IsCover = !hasImages
                    };

                    _context.PropertyImages.Add(image);

                    hasImages = true;
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"تم رفع {files.Count} صورة بنجاح"
            });
        }

        [HttpPost("{propertyId}/tour-video")]
        [Authorize(Roles = "Owner")]
        [RequestSizeLimit(5L * 1024 * 1024 * 1024)]
        public async Task<IActionResult> UploadTourVideo(int propertyId, IFormFile video)
        {
            var property = await _context.Properties.FindAsync(propertyId);
            if (property is null) return NotFound();

            if (property.OwnerId != GetCurrentUserId()) return Forbid();

            try
            {
                property.TourVideoUrl = await _mediaStorage.SaveAsync(video, MediaKind.Video);
                await _context.SaveChangesAsync();
            }
            catch(InvalidOperationException ex) { return BadRequest(ex.Message); }

            return Ok(new { property.TourVideoUrl });
        }
    }
}
