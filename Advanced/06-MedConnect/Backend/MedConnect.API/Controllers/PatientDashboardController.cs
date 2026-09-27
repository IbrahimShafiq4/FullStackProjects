using MedConnect.Application.Features;
using MedConnect.Application.Interfaces;
using MedConnect.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Patient")]
    public class PatientDashboardController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public PatientDashboardController(IAppDbContext context) { _context = context; }

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("me")]
        public async Task<IActionResult> GetMine()
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == UserId);
            if (patient is null) return NotFound();

            var appointments = await _context.Appointments
                .AsNoTracking()
                .Include(a => a.Doctor)
                .Where(a => a.PatientId == patient.Id)
                .ToListAsync();

            var invoices = await _context.Invoices
                .AsNoTracking()
                .Include(i => i.Appointment).ThenInclude(a => a.Doctor)
                .Include(i => i.Appointment).ThenInclude(a => a.Patient)
                .Include(i => i.Payments)
                .Where(i => i.PatientId == patient.Id)
                .OrderByDescending(i => i.IssuedAt)
                .ToListAsync();

            var reviews = await _context.Reviews
                .AsNoTracking()
                .Include(r => r.Doctor)
                .Where(r => r.PatientId == patient.Id)
                .ToListAsync();

            var uploads = await _context.RadiologyUploads
                .AsNoTracking()
                .Include(u => u.Doctor)
                .Where(u => u.PatientId == patient.Id)
                .OrderByDescending(u => u.UploadedAt)
                .Take(10)
                .ToListAsync();

            var totalPaid = invoices
                .SelectMany(i => i.Payments)
                .Where(p => p.Status == PaymentStatus.Completed)
                .Sum(p => p.Amount);

            var pendingInvoices = invoices.Count(i =>
                i.Status != InvoiceStatus.Paid &&
                i.Status != InvoiceStatus.Cancelled);

            var visits = appointments
                .GroupBy(a => a.DoctorId)
                .Select(g => new
                {
                    DoctorId = g.Key,
                    Doctor = g.First().Doctor,
                    Count = g.Count(),
                    LastVisit = g.Max(x => x.ScheduledAt)
                })
                .ToList();

            var recentVisits = new List<DoctorVisitSummaryDto>();
            foreach (var v in visits)
            {
                var doctorTotalPaid = invoices
                    .Where(i => i.DoctorId == v.DoctorId)
                    .SelectMany(i => i.Payments)
                    .Where(p => p.Status == PaymentStatus.Completed)
                    .Sum(p => p.Amount);

                var myReview = reviews.FirstOrDefault(r => r.DoctorId == v.DoctorId);

                var photo = await _context.DoctorProfiles
                    .AsNoTracking()
                    .Where(p => p.DoctorId == v.DoctorId)
                    .Select(p => p.PhotoUrl)
                    .FirstOrDefaultAsync() ?? string.Empty;

                recentVisits.Add(new DoctorVisitSummaryDto(
                    v.DoctorId,
                    v.Doctor?.FullName ?? string.Empty,
                    v.Doctor?.Specialty ?? string.Empty,
                    photo,
                    v.Count,
                    doctorTotalPaid,
                    v.LastVisit,
                    myReview?.Rating,
                    myReview is not null));
            }

            var upcomingAppointments = appointments
                .Where(a => a.Status == Domain.Enums.AppointmentStatus.Booked
                         && a.ScheduledAt >= DateTime.UtcNow)
                .OrderBy(a => a.ScheduledAt)
                .Take(5)
                .Select(a => new AppointmentDto(
                    a.Id,
                    a.ScheduledAt,
                    a.Status.ToString(),
                    a.DoctorId,
                    a.Doctor?.FullName ?? string.Empty,
                    patient.FullName,
                    a.PatientComplaint))
                .ToList();

            var invoiceDtos = invoices
                .Take(10)
                .Select(MapInvoice)
                .ToList();

            return Ok(new PatientDashboardDto(
                appointments.Count,
                totalPaid,
                visits.Count,
                pendingInvoices,
                recentVisits.OrderByDescending(v => v.LastVisitAt).ToList(),
                invoiceDtos,
                reviews.Select(r => new ReviewDto(
                    r.Id,
                    r.DoctorId,
                    r.Doctor?.FullName ?? string.Empty,
                    r.PatientId,
                    patient.FullName,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt)).ToList(),
                uploads.Select(u => new RadiologyUploadDto(
                    u.Id,
                    u.RadiologyRequestId,
                    u.PatientId,
                    patient.FullName,
                    u.DoctorId,
                    u.Doctor?.FullName ?? string.Empty,
                    u.Category.ToString(),
                    u.Title,
                    u.ScanType,
                    u.BodyPart,
                    u.Notes,
                    u.FileUrl,
                    u.FileName,
                    u.MimeType,
                    u.FileSizeBytes,
                    u.IsExternal,
                    u.UploadedAt)).ToList(),
                upcomingAppointments));
        }

        private static InvoiceDto MapInvoice(Invoice i)
        {
            var paid = i.Payments?
                .Where(p => p.Status == PaymentStatus.Completed)
                .Sum(p => p.Amount) ?? 0;

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
                i.Payments?
                    .Select(p => new PaymentDto(
                        p.Id,
                        p.InvoiceId,
                        p.Amount,
                        p.Currency,
                        p.Method.ToString(),
                        p.Status.ToString(),
                        p.TransactionRef,
                        p.Notes,
                        p.CreatedAt,
                        p.CompletedAt))
                    .ToList() ?? new List<PaymentDto>());
        }
    }
}