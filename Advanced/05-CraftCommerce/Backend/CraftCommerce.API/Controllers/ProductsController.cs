using CraftCommerce.Application.Features;
using CraftCommerce.Domain.Entities;
using CraftCommerce.Infrastructure.Data;
using CraftCommerce.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CraftCommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMediaStorageService _mediaStorage;

        public ProductsController
        (
            AppDbContext context,
            IMediaStorageService mediaStorage
        )
        {
            _context = context;
            _mediaStorage = mediaStorage;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetProducts([FromQuery] int? categoryId, [FromQuery] string? search)
        {
            var query = _context.Products
                                .Include(p => p.Category)
                                .Include(p => p.Artisan)
                                .Include(p => p.Images)
                                .Include(p => p.Reviews)
                                .AsQueryable();

            if (categoryId.HasValue)
                query = query.Where(p => p.CategoryId == categoryId.Value);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(p => p.Name.ToLower().Trim().Contains(search.ToLower().Trim()));

            var products = await query.Select(p => new ProductDto
                (
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.Category.Name,
                    p.Artisan.StoreName,
                    p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 0,
                    p.Images.Select(i => new ProductImageDto(i.Id, i.Url)).ToList()
                )).ToListAsync();

            return Ok(products);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductDetails(int id)
        {
            var product = await _context.Products
                                    .Include(p => p.Category)
                                    .Include(p => p.Artisan)
                                    .Include(p => p.Images)
                                    .Include(p => p.Reviews)
                                    .FirstOrDefaultAsync(p => p.Id == id);

            if (product is null) return NotFound();

            return Ok(new ProductDto
                (
                    product.Id,
                    product.Name,
                    product.Description,
                    product.Price,
                    product.StockQuantity,
                    product.Category.Name,
                    product.Artisan.StoreName,
                    product.Reviews.Any() ? product.Reviews.Average(r => r.Rating) : 0,
                    product.Images.Select(i => new ProductImageDto(i.Id, i.Url)).ToList()
                ));
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] CreateProductDto dto, List<IFormFile> images)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                CategoryId = dto.CategoryId,
                ArtisanId = GetCurrentUserId(),
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            foreach (var image in images)
            {
                try
                {
                    var url = await _mediaStorage.SaveAsync(image, MediaKind.Image);
                    _context.ProductImages.Add(new ProductImage { ProductId = product.Id, Url = url });
                }
                catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
            }

            await _context.SaveChangesAsync();
            return Ok(new { productId = product.Id, message = "تم إنشاء هذا المنتج بنجاح" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product is null) return NotFound();

            if (product.ArtisanId != GetCurrentUserId()) return Forbid();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم حذف المنتج بنجاح" });
        }
    }
}