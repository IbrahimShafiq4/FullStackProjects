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
    public class InvoicesController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly INotificationService _notifications;

        public InvoicesController(IAppDbContext context, INotificationService notifications)
        {
            _context = context;
            _notifications = notifications;
        }

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        private string Role => User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        [HttpGet("my")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetMine()
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == UserId);
            if (patient is null) return NotFound();

            var items = await _context.Invoices
                .AsNoTracking()
                .Include(i => i.Appointment).ThenInclude(a => a.Doctor)
                .Include(i => i.Appointment).ThenInclude(a => a.Patient)
                .Include(i => i.Payments)
                .Where(i => i.PatientId == patient.Id)
                .OrderByDescending(i => i.IssuedAt)
                .ToListAsync();

            return Ok(items.Select(Map));
        }

        [HttpGet("doctor")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetDoctorInvoices()
        {
            var items = await _context.Invoices
                .AsNoTracking()
                .Include(i => i.Appointment).ThenInclude(a => a.Doctor)
                .Include(i => i.Appointment).ThenInclude(a => a.Patient)
                .Include(i => i.Payments)
                .Where(i => i.DoctorId == UserId)
                .OrderByDescending(i => i.IssuedAt)
                .ToListAsync();

            return Ok(items.Select(Map));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var invoice = await _context.Invoices
                .AsNoTracking()
                .Include(i => i.Appointment).ThenInclude(a => a.Doctor)
                .Include(i => i.Appointment).ThenInclude(a => a.Patient)
                .Include(i => i.Payments)
                .FirstOrDefaultAsync(i => i.Id == id);
            if (invoice is null) return NotFound();

            if (Role == "Patient")
            {
                var me = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == UserId);
                if (me is null || invoice.PatientId != me.Id) return Forbid();
            }
            else if (Role == "Doctor" && invoice.DoctorId != UserId)
                return Forbid();

            return Ok(Map(invoice));
        }

        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> Create(CreateInvoiceDto dto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == dto.AppointmentId);
            if (appointment is null) return NotFound();
            if (appointment.DoctorId != UserId) return Forbid();

            var existing = await _context.Invoices
                .FirstOrDefaultAsync(i => i.AppointmentId == dto.AppointmentId);
            if (existing is not null) return BadRequest("توجد فاتورة لهذا الموعد مسبقاً");

            var total = dto.ExaminationFee + dto.ConsultationFee + dto.OtherFees - dto.Discount;
            if (total < 0) total = 0;

            var invoice = new Invoice
            {
                AppointmentId = dto.AppointmentId,
                PatientId = appointment.PatientId,
                DoctorId = appointment.DoctorId,
                ExaminationFee = dto.ExaminationFee,
                ConsultationFee = dto.ConsultationFee,
                OtherFees = dto.OtherFees,
                Discount = dto.Discount,
                TotalAmount = total,
                PaidAmount = 0,
                Notes = dto.Notes ?? string.Empty,
                Status = InvoiceStatus.Unpaid
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            await _notifications.PushAsync(
                appointment.Patient.UserId,
                NotificationType.InvoiceIssued,
                "فاتورة جديدة",
                $"صدرت فاتورة بمبلغ {total} {invoice.Currency} للدكتور {appointment.Doctor.FullName}",
                $"/invoices/{invoice.Id}");

            return Ok(new { invoice.Id });
        }

        [HttpPost("{id}/cancel")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> Cancel(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice is null) return NotFound();
            if (invoice.DoctorId != UserId) return Forbid();

            invoice.Status = InvoiceStatus.Cancelled;
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم إلغاء الفاتورة" });
        }

        internal static InvoiceDto Map(Invoice i)
        {
            var paid = i.Payments?.Where(p => p.Status == PaymentStatus.Completed).Sum(p => p.Amount) ?? 0;
            return new InvoiceDto(
                i.Id,
                i.AppointmentId,
                i.Appointment?.ScheduledAt ?? DateTime.MinValue,
                i.Appointment?.Doctor?.FullName ?? string.Empty,
                i.Appointment?.Patient?.FullName ?? string.Empty,
                i.ExaminationFee,
                i.ConsultationFee,
                i.OtherFees,
                i.Discount,
                i.TotalAmount,
                paid,
                i.TotalAmount - paid,
                i.Currency,
                i.Status.ToString(),
                i.Notes,
                i.IssuedAt,
                i.PaidAt,
                i.Payments?.Select(p => new PaymentDto(
                    p.Id, p.InvoiceId, p.Amount, p.Currency,
                    p.Method.ToString(), p.Status.ToString(),
                    p.TransactionRef, p.Notes,
                    p.CreatedAt, p.CompletedAt)).ToList() ?? new());
        }
    }
}