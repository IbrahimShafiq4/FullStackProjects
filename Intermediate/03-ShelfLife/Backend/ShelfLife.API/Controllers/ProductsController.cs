using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShelfLife.Application.DTOs;
using ShelfLife.Application.Interfaces;
using ShelfLife.Application.Services;
using ShelfLife.Domain.Entities;
using ShelfLife.Infrastructure.Services;
using System.Security.Claims;

namespace ShelfLife.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IProductService _productService;
        private readonly IMediaStorageService _mediaStorage;

        public ProductsController(IProductRepository productRepository, IProductService productService, IMediaStorageService mediaStorageService)
        {
            _productRepository = productRepository;
            _productService = productService;
            _mediaStorage = mediaStorageService;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> GetMyProducts()
        {
            var products = await _productService.GetProductsWithFreshnessAsync(GetCurrentUserId());
            return Ok(products);
        }

        [HttpPost]
        public async Task<ActionResult> CreateProduct([FromForm] CreateProductDto dto, IFormFile? photo)
        {
            string? photoUrl = null;

            if (photo != null && photo.Length > 0)
            {
                try
                {
                    photoUrl = await _mediaStorage.SaveAsync(photo, MediaKind.Image);
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            var product = new Product
            {
                Name = dto.Name,
                Quantity = dto.Quantity,
                ExpiryDate = dto.ExpiryDate,
                PhotoUrl = photoUrl,
                AppUserId = GetCurrentUserId(),
                AddedAt = DateTime.UtcNow
            };

            await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();

            return Ok(new
            {
                message = "تم إضافة المنتج بنجاح",
                id = product.Id,
                name = product.Name,
                quantity = product.Quantity,
                photoUrl = product.PhotoUrl,
                expiryDate = product.ExpiryDate,
                voiceNoteUrl = product.VoiceNoteUrl
            });
        }

        [HttpPost("{id}/voice-note")]
        public async Task<ActionResult> UploadVoiceNote(int id, IFormFile? voiceNote)
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product is null)
                return NotFound();

            if (product.AppUserId != GetCurrentUserId())
                return Forbid();

            if (voiceNote == null || voiceNote.Length == 0)
                return BadRequest("الملف الصوتي غير صالح");

            try
            {
                if (!string.IsNullOrEmpty(product.VoiceNoteUrl))
                {
                    _mediaStorage.Delete(product.VoiceNoteUrl);
                }

                product.VoiceNoteUrl = await _mediaStorage.SaveAsync(voiceNote, MediaKind.Audio);
                await _productRepository.SaveChangesAsync();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok(new
            {
                voiceNoteUrl = product.VoiceNoteUrl
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product is null)
                return NotFound();

            if (product.AppUserId != GetCurrentUserId())
                return Forbid();

            var productName = product.Name;

            if (!string.IsNullOrEmpty(product.PhotoUrl))
            {
                _mediaStorage.Delete(product.PhotoUrl);
            }

            if (!string.IsNullOrEmpty(product.VoiceNoteUrl))
            {
                _mediaStorage.Delete(product.VoiceNoteUrl);
            }

            await _productRepository.DeleteAsync(product);
            await _productRepository.SaveChangesAsync();

            return Ok(new
            {
                message = $"تم حذف {productName} بنجاح"
            });
        }
    }
}