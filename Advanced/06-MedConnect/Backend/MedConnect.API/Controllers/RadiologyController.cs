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
    public class RadiologyController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly INotificationService _notifications;

        public RadiologyController(
            IAppDbContext context,
            IWebHostEnvironment env,
            INotificationService notifications)
        {
            _context = context;
            _env = env;
            _notifications = notifications;
        }

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        private string Role => User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        [HttpGet("requests/appointment/{appointmentId}")]
        public async Task<IActionResult> GetRequestsByAppointment(int appointmentId)
        {
            var items = await _context.RadiologyRequests
                .AsNoTracking()
                .Include(r => r.Appointment).ThenInclude(a => a.Patient)
                .Include(r => r.Appointment).ThenInclude(a => a.Doctor)
                .Where(r => r.AppointmentId == appointmentId)
                .OrderByDescending(r => r.RequestedAt)
                .ToListAsync();

            return Ok(items.Select(MapRequest));
        }

        [HttpGet("requests/patient/{patientId}")]
        public async Task<IActionResult> GetRequestsByPatient(int patientId)
        {
            var items = await _context.RadiologyRequests
                .AsNoTracking()
                .Include(r => r.Appointment).ThenInclude(a => a.Patient)
                .Include(r => r.Appointment).ThenInclude(a => a.Doctor)
                .Where(r => r.Appointment.PatientId == patientId)
                .OrderByDescending(r => r.RequestedAt)
                .ToListAsync();

            return Ok(items.Select(MapRequest));
        }

        [HttpPost("requests")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> CreateRequest(CreateRadiologyRequestDto dto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == dto.AppointmentId);

            if (appointment is null) return NotFound();
            if (appointment.DoctorId != UserId) return Forbid();

            var request = new RadiologyRequest
            {
                AppointmentId = dto.AppointmentId,
                ScanType = dto.ScanType ?? string.Empty,
                BodyPart = dto.BodyPart ?? string.Empty,
                Instructions = dto.Instructions ?? string.Empty,
                Status = RadiologyRequestStatus.Pending
            };

            _context.RadiologyRequests.Add(request);
            await _context.SaveChangesAsync();

            await _notifications.PushAsync(
                appointment.Patient.UserId,
                NotificationType.RadiologyReady,
                "طلب أشعة جديد",
                $"الدكتور {appointment.Doctor.FullName} طلب {dto.ScanType} على {dto.BodyPart}",
                $"/radiology/upload/{request.Id}");

            return Ok(new { request.Id });
        }

        [HttpPost("requests/{id}/cancel")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> CancelRequest(int id)
        {
            var request = await _context.RadiologyRequests
                .Include(r => r.Appointment)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (request is null) return NotFound();
            if (request.Appointment.DoctorId != UserId) return Forbid();

            request.Status = RadiologyRequestStatus.Cancelled;
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم إلغاء الطلب" });
        }

        [HttpGet("uploads/patient/{patientId}")]
        public async Task<IActionResult> GetUploadsByPatient(int patientId)
        {
            if (Role == "Patient")
            {
                var me = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == UserId);
                if (me is null || me.Id != patientId) return Forbid();
            }

            var items = await _context.RadiologyUploads
                .AsNoTracking()
                .Include(u => u.Patient)
                .Include(u => u.Doctor)
                .Where(u => u.PatientId == patientId)
                .OrderByDescending(u => u.UploadedAt)
                .ToListAsync();

            return Ok(items.Select(MapUpload));
        }

        [HttpGet("uploads/doctor/{doctorId}")]
        public async Task<IActionResult> GetUploadsByDoctor(string doctorId)
        {
            var items = await _context.RadiologyUploads
                .AsNoTracking()
                .Include(u => u.Patient)
                .Include(u => u.Doctor)
                .Where(u => u.DoctorId == doctorId)
                .OrderByDescending(u => u.UploadedAt)
                .ToListAsync();

            return Ok(items.Select(MapUpload));
        }

        [HttpGet("uploads/{id}")]
        public async Task<IActionResult> GetUpload(int id)
        {
            var upload = await _context.RadiologyUploads
                .AsNoTracking()
                .Include(u => u.Patient)
                .Include(u => u.Doctor)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (upload is null) return NotFound();
            return Ok(MapUpload(upload));
        }

        [HttpPost("uploads")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> CreateUpload(
            [FromForm] string doctorId,
            [FromForm] string? category,
            [FromForm] string? title,
            [FromForm] string? scanType,
            [FromForm] string? bodyPart,
            [FromForm] string? notes,
            [FromForm] bool isExternal,
            [FromForm] int? radiologyRequestId,
            IFormFile file)
        {
            if (file is null || file.Length == 0)
                return BadRequest("لم يتم اختيار ملف");

            if (file.Length > 100 * 1024 * 1024)
                return BadRequest("الحد الأقصى 100 ميجا");

            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == UserId);
            if (patient is null) return NotFound("بيانات المريض غير موجودة");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            var allowed = new[]
            {
        ".jpg", ".jpeg", ".png", ".webp", ".gif",
        ".pdf", ".dcm",
        ".mp4", ".mov", ".webm", ".avi", ".mkv"
    };
            if (!allowed.Contains(ext))
                return BadRequest($"صيغة الملف غير مدعومة: {ext}");

            var parsedCategory = PatientFileCategory.Radiology;
            if (!string.IsNullOrWhiteSpace(category) &&
                Enum.TryParse<PatientFileCategory>(category, true, out var parsed))
            {
                parsedCategory = parsed;
            }

            var folder = Path.Combine(_env.WebRootPath, "uploads", "radiology");
            Directory.CreateDirectory(folder);
            var fileName = $"{Guid.NewGuid():N}{ext}";
            var fullPath = Path.Combine(folder, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
                await file.CopyToAsync(stream);

            var upload = new RadiologyUpload
            {
                PatientId = patient.Id,
                DoctorId = doctorId,
                RadiologyRequestId = radiologyRequestId,
                Category = parsedCategory,
                Title = title ?? string.Empty,
                ScanType = scanType ?? string.Empty,
                BodyPart = bodyPart ?? string.Empty,
                Notes = notes ?? string.Empty,
                FileUrl = $"/uploads/radiology/{fileName}",
                FileName = file.FileName,
                MimeType = file.ContentType ?? string.Empty,
                FileSizeBytes = file.Length,
                IsExternal = isExternal
            };

            _context.RadiologyUploads.Add(upload);

            if (radiologyRequestId.HasValue)
            {
                var req = await _context.RadiologyRequests
                    .FirstOrDefaultAsync(r => r.Id == radiologyRequestId.Value);
                if (req is not null)
                {
                    req.Status = RadiologyRequestStatus.Fulfilled;
                    req.FulfilledAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();

            await _notifications.PushAsync(
                doctorId,
                NotificationType.RadiologyReady,
                "ملف جديد من مريض",
                $"{patient.FullName} رفع {parsedCategory} — {title}",
                "/dashboard");

            return Ok(new { upload.Id, upload.FileUrl });
        }

        private static RadiologyRequestDto MapRequest(RadiologyRequest r) => new(
            r.Id,
            r.AppointmentId,
            r.Appointment?.Patient?.FullName ?? string.Empty,
            r.Appointment?.Doctor?.FullName ?? string.Empty,
            r.ScanType,
            r.BodyPart,
            r.Instructions,
            r.Status.ToString(),
            r.RequestedAt,
            r.FulfilledAt);

        private static RadiologyUploadDto MapUpload(RadiologyUpload u) => new(
            u.Id,
            u.RadiologyRequestId,
            u.PatientId,
            u.Patient?.FullName ?? string.Empty,
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
            u.UploadedAt);
    }
}