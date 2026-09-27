using MedConnect.Application.Features;
using MedConnect.Application.Interfaces;
using MedConnect.Domain.Entities;
using MedConnect.Domain.Enums;
using MedConnect.Infrastructure.Services.BookingHandlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentsController : Controller
    {
        private readonly IAppDbContext _context;
        private readonly IBookingChainFactory _chainFactory;

        public AppointmentsController(
            IAppDbContext context,
            IBookingChainFactory chainFactory
        )
        { _context = context; _chainFactory = chainFactory; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        private string GetCurrentRole() =>
            User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        [HttpPost]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> BookAppointment(BookAppointmentDto dto)
        {
            var userId = GetCurrentUserId();
            var patient = await _context.Patients
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient is null) return BadRequest("بيانات المريض غير موجودة");

            var chain = _chainFactory.BuildChain();
            var result = await chain.HandleAsync(
                new BookingRequest
                {
                    DoctorId = dto.DoctorId,
                    PatientId = patient.Id,
                    ScheduledAt = dto.ScheduledAt
                }
            );

            if (!result.Success) return BadRequest(result.ErrorMessage);

            var appointment = new Appointment
            {
                DoctorId = dto.DoctorId,
                PatientId = patient.Id,
                ScheduledAt = dto.ScheduledAt,
                PatientComplaint = dto.PatientComplaint ?? string.Empty
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Create invoice automatically with doctor's fees
            var profile = await _context.DoctorProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.DoctorId == dto.DoctorId);

            decimal examFee = profile?.ExaminationFee ?? 0;
            decimal total = examFee;
            var currency = profile?.Currency ?? "EGP";

            var invoice = new Invoice
            {
                AppointmentId = appointment.Id,
                PatientId = patient.Id,
                DoctorId = dto.DoctorId,
                ExaminationFee = examFee,
                ConsultationFee = 0,
                OtherFees = 0,
                Discount = 0,
                TotalAmount = total,
                PaidAmount = 0,
                Currency = currency,
                Status = InvoiceStatus.Unpaid
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            // If pay online — create completed payment
            if (dto.PayOnline && !string.IsNullOrWhiteSpace(dto.PaymentMethod))
            {
                if (Enum.TryParse<PaymentMethod>(dto.PaymentMethod, true, out var method))
                {
                    var payment = new Payment
                    {
                        InvoiceId = invoice.Id,
                        Amount = total,
                        Currency = currency,
                        Method = method,
                        Status = PaymentStatus.Completed,
                        TransactionRef = $"TXN-{Guid.NewGuid():N}".Substring(0, 20).ToUpper(),
                        Notes = "دفع إلكتروني عند الحجز",
                        CompletedAt = DateTime.UtcNow
                    };

                    _context.Payments.Add(payment);

                    invoice.PaidAmount = total;
                    invoice.Status = InvoiceStatus.Paid;
                    invoice.PaidAt = DateTime.UtcNow;

                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new
            {
                appointment.Id,
                invoiceId = invoice.Id,
                invoiceStatus = invoice.Status.ToString(),
                total = invoice.TotalAmount,
                currency = invoice.Currency
            });
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var userId = GetCurrentUserId();
            var role = GetCurrentRole();

            IQueryable<Appointment> query = _context.Appointments
                .AsNoTracking()
                .Include(a => a.Doctor)
                .Include(a => a.Patient);

            if (role == "Doctor")
                query = query.Where(a => a.DoctorId == userId);
            else
                query = query.Where(a => a.Patient.UserId == userId);

            var appointments = await query
                .Select(a => new AppointmentDto(
                    a.Id,
                    a.ScheduledAt,
                    a.Status.ToString(),
                    a.DoctorId,
                    a.Doctor.FullName,
                    a.Patient.FullName,
                    a.PatientComplaint))
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpGet("doctor/{doctorId}")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetDoctorBookedSlots(string doctorId)
        {
            var slots = await _context.Appointments
                .AsNoTracking()
                .Where(a => a.DoctorId == doctorId
                         && a.Status != AppointmentStatus.Cancelled)
                .Select(a => new { a.Id, a.ScheduledAt })
                .ToListAsync();

            return Ok(slots);
        }
    }
}