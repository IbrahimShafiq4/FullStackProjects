using CraftCommerce.Application.Features;
using CraftCommerce.Domain.Entities;
using CraftCommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CraftCommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ReviewsController(AppDbContext context) { _context = context; }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost("product/{productId}")]
        public async Task<IActionResult> AddReview(int productId, CreateReviewDto dto)
        {
            if (dto.Rating is < 1 or > 5) return BadRequest("التقييم يجب ان يكون بين 1 و 5");

            var productExists = await _context.Products.AnyAsync(p => p.Id == productId);
            if (!productExists) return NotFound("المنتج غير موجود");

            var existingReview = await _context.Reviews.AnyAsync(r =>
                r.ProductId == productId && r.BuyerId == GetCurrentUserId());
            if (existingReview) return BadRequest("لقد قمت بتقييم هذا المنتج من قبل");

            var review = new Review
            {
                ProductId = productId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                BuyerId = GetCurrentUserId()
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return Ok(new { review.Id });
        }

        [HttpGet("my-reviews")]
        public async Task<IActionResult> GetMyReviews()
        {
            var myReviews = await _context.Reviews
                .Where(r => r.BuyerId == GetCurrentUserId())
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto(
                    r.Id, r.Rating, r.Comment, r.CreatedAt,
                    r.ProductId, r.Product.Name, r.BuyerId))
                .ToListAsync();

            return Ok(myReviews);
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _context.Reviews
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto(
                    r.Id, r.Rating, r.Comment, r.CreatedAt,
                    r.ProductId, r.Product.Name, r.BuyerId))
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpGet("product/{productId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductReviews(int productId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto(
                    r.Id, r.Rating, r.Comment, r.CreatedAt,
                    r.ProductId, r.Product.Name, r.BuyerId))
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpPut("update/{productId}/{reviewId}")]
        public async Task<IActionResult> Update(int productId, int reviewId, CreateReviewDto dto)
        {
            var review = await _context.Reviews.FirstOrDefaultAsync(r =>
                r.ProductId == productId && r.Id == reviewId && r.BuyerId == GetCurrentUserId());
            if (review is null) return NotFound("التقييم غير موجود");

            if (dto.Rating is < 1 or > 5) return BadRequest("التقييم يجب ان يكون بين 1 و 5");

            review.Comment = dto.Comment;
            review.Rating = dto.Rating;
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم تعديل التقييم الخاص بك" });
        }

        [HttpDelete("{productId}/{reviewId}")]
        public async Task<IActionResult> Delete(int productId, int reviewId)
        {
            var review = await _context.Reviews.FirstOrDefaultAsync(r =>
                r.ProductId == productId && r.Id == reviewId && r.BuyerId == GetCurrentUserId());
            if (review is null) return NotFound("التقييم غير موجود");

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم حذف التقييم بنجاح" });
        }
    }
}