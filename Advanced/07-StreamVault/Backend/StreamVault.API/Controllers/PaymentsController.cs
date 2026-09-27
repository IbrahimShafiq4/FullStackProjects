using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamVault.Application.Features;
using StreamVault.Application.Interfaces;
using StreamVault.Domain.Domain;
using StreamVault.Infrastructure.Services;
using System.Security.Claims;

namespace StreamVault.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly IPaymentService _paymentService;

        public PaymentsController(IAppDbContext context, IPaymentService paymentService)
        {
            _context = context;
            _paymentService = paymentService;
        }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout(CheckoutDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var payment = await _paymentService.CreateCheckoutAsync(
                    CurrentUserId,
                    (PaymentPurpose)dto.Purpose,
                    dto.CourseId,
                    dto.StudyFileId,
                    cancellationToken);

                return Ok(new
                {
                    paymentId = payment.Id,
                    amount = payment.Amount,
                    currency = payment.Currency,
                    description = payment.Description
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id:int}/confirm")]
        public async Task<IActionResult> Confirm(int id, CancellationToken cancellationToken)
        {
            try
            {
                var payment = await _paymentService.ConfirmAsync(id, CurrentUserId, cancellationToken);

                return Ok(new
                {
                    message = "تم الدفع بنجاح",
                    paymentId = payment.Id,
                    status = payment.Status.ToString(),
                    transactionId = payment.ProviderTransactionId,
                    completedAt = payment.CompletedAt
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPayment(int id, CancellationToken cancellationToken)
        {
            var payment = await _context.Payments
                .AsNoTracking()
                .Where(p => p.Id == id && p.StudentId == CurrentUserId)
                .Select(p => new PaymentDetailDto(
                    p.Id,
                    p.Description,
                    p.Amount,
                    p.Currency,
                    (int)p.Status,
                    (int)p.Purpose,
                    p.TeacherId,
                    p.Teacher != null ? p.Teacher.FullName : null,
                    p.CourseId,
                    p.StudyFileId))
                .FirstOrDefaultAsync(cancellationToken);

            if (payment is null)
                return NotFound(new { message = "الفاتورة غير موجودة" });

            return Ok(payment);
        }

        [HttpGet("check/course/{courseId:int}")]
        public async Task<IActionResult> CheckCoursePurchase(int courseId, CancellationToken cancellationToken)
        {
            var hasPurchased = await _context.Payments
                .AsNoTracking()
                .AnyAsync(p => p.StudentId == CurrentUserId
                            && p.CourseId == courseId
                            && p.Status == PaymentStatus.Succeeded, cancellationToken);

            return Ok(new { hasPurchased });
        }

        [HttpGet("check/studyfile/{studyFileId:int}")]
        public async Task<IActionResult> CheckStudyFilePurchase(int studyFileId, CancellationToken cancellationToken)
        {
            var hasPurchased = await _context.Payments
                .AsNoTracking()
                .AnyAsync(p => p.StudentId == CurrentUserId
                            && p.StudyFileId == studyFileId
                            && p.Status == PaymentStatus.Succeeded, cancellationToken);

            return Ok(new { hasPurchased });
        }

        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> MyPayments(CancellationToken cancellationToken)
        {
            var payments = await _context.Payments
                .AsNoTracking()
                .Where(p => p.StudentId == CurrentUserId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new PaymentDto(
                    p.Id,
                    p.Description,
                    p.Amount,
                    p.Currency,
                    (int)p.Status,
                    (int)p.Purpose,
                    p.Teacher != null ? p.Teacher.FullName : null,
                    p.Course != null ? p.Course.Title : null,
                    p.StudyFile != null ? p.StudyFile.Title : null,
                    p.CreatedAt,
                    p.CompletedAt))
                .ToListAsync(cancellationToken);

            return Ok(payments);
        }

        [HttpGet("received")]
        [Authorize(Roles = "Instructor")]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> ReceivedPayments(CancellationToken cancellationToken)
        {
            var payments = await _context.Payments
                .AsNoTracking()
                .Where(p => p.TeacherId == CurrentUserId && p.Status == PaymentStatus.Succeeded)
                .OrderByDescending(p => p.CompletedAt)
                .Select(p => new PaymentDto(
                    p.Id,
                    p.Description,
                    p.Amount,
                    p.Currency,
                    (int)p.Status,
                    (int)p.Purpose,
                    p.Student.FullName,
                    p.Course != null ? p.Course.Title : null,
                    p.StudyFile != null ? p.StudyFile.Title : null,
                    p.CreatedAt,
                    p.CompletedAt))
                .ToListAsync(cancellationToken);

            return Ok(payments);
        }

        [HttpGet("statistics")]
        [Authorize(Roles = "Instructor")]
        public async Task<ActionResult<TeacherStatisticsDto>> Statistics(CancellationToken cancellationToken)
        {
            var teacherId = CurrentUserId;

            var succeededPayments = await _context.Payments
                .AsNoTracking()
                .Where(p => p.TeacherId == teacherId && p.Status == PaymentStatus.Succeeded)
                .ToListAsync(cancellationToken);

            var totalEarnings = succeededPayments.Sum(p => p.Amount);
            var totalStudents = succeededPayments.Select(p => p.StudentId).Distinct().Count();

            var totalCourses = await _context.Courses
                .AsNoTracking()
                .CountAsync(c => c.InstructorId == teacherId, cancellationToken);

            var teacherCourseIds = await _context.Courses
                .AsNoTracking()
                .Where(c => c.InstructorId == teacherId)
                .Select(c => c.Id)
                .ToListAsync(cancellationToken);

            var courseReviews = await _context.Reviews
                .AsNoTracking()
                .Where(r => r.TargetType == ReviewTargetType.Course && teacherCourseIds.Contains(r.TargetId))
                .ToListAsync(cancellationToken);

            var averageRating = courseReviews.Count > 0 ? courseReviews.Average(r => r.Rating) : 0;

            var topCourseGroup = succeededPayments
                .Where(p => p.CourseId.HasValue)
                .GroupBy(p => p.CourseId!.Value)
                .Select(g => new { CourseId = g.Key, Sales = g.Count() })
                .OrderByDescending(x => x.Sales)
                .FirstOrDefault();

            string? topCourseTitle = null;
            int topCourseSales = 0;

            if (topCourseGroup is not null)
            {
                topCourseTitle = await _context.Courses
                    .AsNoTracking()
                    .Where(c => c.Id == topCourseGroup.CourseId)
                    .Select(c => c.Title)
                    .FirstOrDefaultAsync(cancellationToken);

                topCourseSales = topCourseGroup.Sales;
            }

            var monthlyEarnings = succeededPayments
                .Where(p => p.CompletedAt.HasValue && p.CompletedAt.Value >= DateTime.UtcNow.AddMonths(-6))
                .GroupBy(p => new { p.CompletedAt!.Value.Year, p.CompletedAt.Value.Month })
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => new MonthlyEarningDto(
                    $"{g.Key.Year}-{g.Key.Month:D2}",
                    g.Sum(x => x.Amount),
                    g.Count()))
                .ToList();

            return Ok(new TeacherStatisticsDto(
                totalEarnings,
                totalStudents,
                totalCourses,
                Math.Round(averageRating, 2),
                courseReviews.Count,
                topCourseTitle,
                topCourseSales,
                monthlyEarnings));
        }
    }
}