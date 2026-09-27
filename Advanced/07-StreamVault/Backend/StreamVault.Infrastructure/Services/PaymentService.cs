using Microsoft.EntityFrameworkCore;
using StreamVault.Application.Interfaces;
using StreamVault.Domain.Domain;
using StreamVault.Domain.Services;

namespace StreamVault.Infrastructure.Services
{
    public interface IPaymentService
    {
        Task<Payment> CreateCheckoutAsync(string studentId, PaymentPurpose purpose, int? courseId, int? studyFileId, CancellationToken cancellationToken);
        Task<Payment> ConfirmAsync(int paymentId, string studentId, CancellationToken cancellationToken);
    }

    public class DummyPaymentService : IPaymentService
    {
        private readonly IAppDbContext _context;
        private readonly ISubscriptionValidator _validator;
        private const decimal SubscriptionPrice = 199m;
        private const decimal CoursePrice = 299m;
        private const int ArtificialDelayMs = 2000;

        public DummyPaymentService(IAppDbContext context, ISubscriptionValidator validator)
        {
            _context = context;
            _validator = validator;
        }

        public async Task<Payment> CreateCheckoutAsync(string studentId, PaymentPurpose purpose, int? courseId, int? studyFileId, CancellationToken cancellationToken)
        {
            decimal amount;
            string description;
            string? teacherId;

            if (purpose == PaymentPurpose.Subscription)
            {
                amount = SubscriptionPrice;
                description = "اشتراك شهري في منصة StreamVault";
                teacherId = null;
            }
            else if (purpose == PaymentPurpose.Course && courseId.HasValue)
            {
                var course = await _context.Courses
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Id == courseId.Value, cancellationToken);

                if (course is null)
                    throw new InvalidOperationException("الكورس غير موجود");

                amount = CoursePrice;
                description = $"شراء كورس: {course.Title}";
                teacherId = course.InstructorId;
            }
            else if (purpose == PaymentPurpose.StudyFile && studyFileId.HasValue)
            {
                var file = await _context.StudyFiles
                    .AsNoTracking()
                    .FirstOrDefaultAsync(f => f.Id == studyFileId.Value, cancellationToken);

                if (file is null)
                    throw new InvalidOperationException("الملف غير موجود");

                if (file.IsFree)
                    throw new InvalidOperationException("هذا الملف مجاني ولا يحتاج دفع");

                amount = file.Price;
                description = $"شراء مذكرة: {file.Title}";
                teacherId = file.TeacherId;
            }
            else
            {
                throw new InvalidOperationException("نوع الدفع غير مدعوم");
            }

            var payment = new Payment
            {
                StudentId = studentId,
                TeacherId = teacherId,
                Purpose = purpose,
                CourseId = courseId,
                StudyFileId = studyFileId,
                Amount = amount,
                Currency = "EGP",
                Status = PaymentStatus.Pending,
                Provider = PaymentProvider.Dummy,
                Description = description
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync(cancellationToken);
            return payment;
        }

        public async Task<Payment> ConfirmAsync(int paymentId, string studentId, CancellationToken cancellationToken)
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.Id == paymentId && p.StudentId == studentId, cancellationToken);

            if (payment is null)
                throw new InvalidOperationException("عملية الدفع غير موجودة");

            if (payment.Status != PaymentStatus.Pending)
                throw new InvalidOperationException("هذه العملية تمت بالفعل");

            await Task.Delay(ArtificialDelayMs, cancellationToken);

            payment.Status = PaymentStatus.Succeeded;
            payment.CompletedAt = DateTime.UtcNow;
            payment.ProviderTransactionId = Guid.NewGuid().ToString("N");

            if (payment.Purpose == PaymentPurpose.Subscription)
            {
                var existing = await _context.Subscriptions
                    .FirstOrDefaultAsync(s => s.SubscriberId == studentId, cancellationToken);

                if (existing is null || !_validator.IsActive(existing, DateTime.UtcNow))
                {
                    _context.Subscriptions.Add(new Subscription
                    {
                        SubscriberId = studentId,
                        DurationDays = 30,
                        StartedAt = DateTime.UtcNow
                    });
                }
                else
                {
                    existing.DurationDays += 30;
                }
            }

            await _context.SaveChangesAsync(cancellationToken);
            return payment;
        }
    }
}