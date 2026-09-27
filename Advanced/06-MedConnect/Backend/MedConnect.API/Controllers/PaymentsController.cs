using MedConnect.Application.Features;
using MedConnect.Application.Interfaces;
using MedConnect.Domain.Entities;
using MedConnect.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly INotificationService _notifications;

        public PaymentsController(IAppDbContext context, INotificationService notifications)
        {
            _context = context;
            _notifications = notifications;
        }

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost("pay")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> Pay(CreatePaymentDto dto)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Appointment).ThenInclude(a => a.Doctor)
                .Include(i => i.Appointment).ThenInclude(a => a.Patient)
                .FirstOrDefaultAsync(i => i.Id == dto.InvoiceId);
            if (invoice is null) return NotFound();

            var me = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == UserId);
            if (me is null || invoice.PatientId != me.Id) return Forbid();

            if (invoice.Status == InvoiceStatus.Paid) return BadRequest("الفاتورة مدفوعة بالكامل");
            if (dto.Amount <= 0) return BadRequest("المبلغ غير صحيح");

            if (!Enum.TryParse<PaymentMethod>(dto.Method, true, out var method))
                return BadRequest("طريقة الدفع غير صحيحة");

            var alreadyPaid = await _context.Payments
                .Where(p => p.InvoiceId == invoice.Id && p.Status == PaymentStatus.Completed)
                .SumAsync(p => p.Amount);

            var remaining = invoice.TotalAmount - alreadyPaid;
            if (dto.Amount > remaining) return BadRequest($"المتبقي {remaining} فقط");

            var payment = new Payment
            {
                InvoiceId = invoice.Id,
                Amount = dto.Amount,
                Currency = invoice.Currency,
                Method = method,
                Status = PaymentStatus.Completed,
                TransactionRef = string.IsNullOrEmpty(dto.TransactionRef)
                                    ? $"TXN-{Guid.NewGuid():N}".Substring(0, 20).ToUpper()
                                    : dto.TransactionRef,
                Notes = dto.Notes ?? string.Empty,
                CompletedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            var newPaid = alreadyPaid + dto.Amount;
            if (newPaid >= invoice.TotalAmount)
            {
                invoice.Status = InvoiceStatus.Paid;
                invoice.PaidAmount = newPaid;
                invoice.PaidAt = DateTime.UtcNow;
            }
            else
            {
                invoice.Status = InvoiceStatus.PartiallyPaid;
                invoice.PaidAmount = newPaid;
            }

            await _context.SaveChangesAsync();

            await _notifications.PushAsync(
                UserId,
                NotificationType.PaymentSuccess,
                "تم الدفع بنجاح",
                $"دفعت {dto.Amount} {invoice.Currency} للدكتور {invoice.Appointment.Doctor.FullName}",
                $"/invoices/{invoice.Id}");

            await _notifications.PushAsync(
                invoice.DoctorId,
                NotificationType.PaymentSuccess,
                "دفعة جديدة",
                $"{invoice.Appointment.Patient.FullName} دفع {dto.Amount} {invoice.Currency}",
                $"/dashboard");

            return Ok(new
            {
                payment.Id,
                payment.TransactionRef,
                Status = invoice.Status.ToString()
            });
        }

        [HttpGet("invoice/{invoiceId}")]
        public async Task<IActionResult> GetByInvoice(int invoiceId)
        {
            var invoice = await _context.Invoices
                .FirstOrDefaultAsync(i => i.Id == invoiceId);
            if (invoice is null) return NotFound();

            var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
            if (role == "Doctor" && invoice.DoctorId != UserId) return Forbid();

            var items = await _context.Payments
                .AsNoTracking()
                .Where(p => p.InvoiceId == invoiceId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(items.Select(p => new PaymentDto(
                p.Id, p.InvoiceId, p.Amount, p.Currency,
                p.Method.ToString(), p.Status.ToString(),
                p.TransactionRef, p.Notes,
                p.CreatedAt, p.CompletedAt)));
        }
    }
}