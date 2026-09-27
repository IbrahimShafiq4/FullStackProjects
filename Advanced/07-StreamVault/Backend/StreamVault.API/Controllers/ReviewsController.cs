using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamVault.Application.Features;
using StreamVault.Application.Interfaces;
using StreamVault.Domain.Domain;
using System.Security.Claims;

namespace StreamVault.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReviewsController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public ReviewsController(IAppDbContext context)
        {
            _context = context;
        }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();

        [HttpPost]
        public async Task<IActionResult> Create(CreateReviewDto dto, CancellationToken cancellationToken)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
                return BadRequest(new { message = "التقييم لازم يكون من ١ لـ ٥" });

            var targetType = (ReviewTargetType)dto.TargetType;

            bool validTarget = false;
            bool canReview = false;

            switch (targetType)
            {
                case ReviewTargetType.Teacher:
                    validTarget = await _context.Users.AnyAsync(u => u.Id == dto.TargetId.ToString(), cancellationToken);
                    canReview = validTarget;
                    break;

                case ReviewTargetType.Course:
                    validTarget = await _context.Courses.AnyAsync(c => c.Id == dto.TargetId, cancellationToken);
                    if (validTarget)
                    {
                        canReview = await _context.Payments
                            .AsNoTracking()
                            .AnyAsync(p => p.StudentId == CurrentUserId
                                        && p.CourseId == dto.TargetId
                                        && p.Status == PaymentStatus.Succeeded, cancellationToken);
                    }
                    break;

                case ReviewTargetType.StudyFile:
                    validTarget = await _context.StudyFiles.AnyAsync(s => s.Id == dto.TargetId, cancellationToken);
                    if (validTarget)
                    {
                        canReview = await _context.Payments
                            .AsNoTracking()
                            .AnyAsync(p => p.StudentId == CurrentUserId
                                        && p.StudyFileId == dto.TargetId
                                        && p.Status == PaymentStatus.Succeeded, cancellationToken);
                    }
                    break;
            }

            if (!validTarget)
                return NotFound(new { message = "العنصر المطلوب تقييمه غير موجود" });

            if (!canReview)
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "لازم تشتري الكورس الأول قبل التقييم" });

            var alreadyReviewed = await _context.Reviews
                .AnyAsync(r => r.AuthorId == CurrentUserId
                            && r.TargetType == targetType
                            && r.TargetId == dto.TargetId, cancellationToken);

            if (alreadyReviewed)
                return Conflict(new { message = "قمت بتقييم هذا العنصر بالفعل" });

            var review = new Review
            {
                AuthorId = CurrentUserId,
                TargetType = targetType,
                TargetId = dto.TargetId,
                Rating = dto.Rating,
                Comment = dto.Comment
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync(cancellationToken);

            return StatusCode(StatusCodes.Status201Created, new { review.Id });
        }

        [HttpGet("target")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetForTarget(
            [FromQuery] int targetType,
            [FromQuery] int targetId,
            CancellationToken cancellationToken)
        {
            var reviews = await _context.Reviews
                .AsNoTracking()
                .Where(r => r.TargetType == (ReviewTargetType)targetType && r.TargetId == targetId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto(r.Id, r.Author.FullName, r.Rating, r.Comment, r.CreatedAt))
                .ToListAsync(cancellationToken);

            return Ok(reviews);
        }

        [HttpGet("summary")]
        [AllowAnonymous]
        public async Task<ActionResult<RatingSummaryDto>> GetSummary(
            [FromQuery] int targetType,
            [FromQuery] int targetId,
            CancellationToken cancellationToken)
        {
            var ratings = await _context.Reviews
                .AsNoTracking()
                .Where(r => r.TargetType == (ReviewTargetType)targetType && r.TargetId == targetId)
                .Select(r => r.Rating)
                .ToListAsync(cancellationToken);

            var avg = ratings.Count > 0 ? ratings.Average() : 0;
            return Ok(new RatingSummaryDto(Math.Round(avg, 2), ratings.Count));
        }

        [HttpGet("can-review")]
        public async Task<IActionResult> CanReview(
            [FromQuery] int targetType,
            [FromQuery] int targetId,
            CancellationToken cancellationToken)
        {
            var tt = (ReviewTargetType)targetType;

            var alreadyReviewed = await _context.Reviews
                .AsNoTracking()
                .AnyAsync(r => r.AuthorId == CurrentUserId
                            && r.TargetType == tt
                            && r.TargetId == targetId, cancellationToken);

            bool canReview = false;

            if (!alreadyReviewed)
            {
                if (tt == ReviewTargetType.Course)
                {
                    canReview = await _context.Payments
                        .AsNoTracking()
                        .AnyAsync(p => p.StudentId == CurrentUserId
                                    && p.CourseId == targetId
                                    && p.Status == PaymentStatus.Succeeded, cancellationToken);
                }
                else if (tt == ReviewTargetType.StudyFile)
                {
                    canReview = await _context.Payments
                        .AsNoTracking()
                        .AnyAsync(p => p.StudentId == CurrentUserId
                                    && p.StudyFileId == targetId
                                    && p.Status == PaymentStatus.Succeeded, cancellationToken);
                }
                else
                {
                    canReview = true;
                }
            }

            return Ok(new { canReview, alreadyReviewed });
        }
    }
}