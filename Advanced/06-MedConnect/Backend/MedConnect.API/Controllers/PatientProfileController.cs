using System.Text.Json;
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
    [Authorize]
    public class PatientProfileController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public PatientProfileController(IAppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        private string Role => User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        [HttpGet("me")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetMine()
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == UserId);
            if (patient is null) return NotFound();
            return await BuildDto(patient.Id);
        }

        [HttpGet("{patientId}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetById(int patientId)
        {
            return await BuildDto(patientId);
        }

        [HttpPut("me")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> UpdateMine(UpdatePatientProfileDto dto)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == UserId);
            if (patient is null) return NotFound();

            var profile = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.PatientId == patient.Id);
            if (profile is null)
            {
                profile = new PatientProfile { PatientId = patient.Id };
                _context.PatientProfiles.Add(profile);
            }

            if (dto.PhotoUrl is not null) profile.PhotoUrl = dto.PhotoUrl;
            if (dto.BloodType is not null) profile.BloodType = dto.BloodType;
            if (dto.DateOfBirth.HasValue) profile.DateOfBirth = dto.DateOfBirth;
            if (dto.Gender is not null) profile.Gender = dto.Gender;
            if (dto.Phone is not null) profile.Phone = dto.Phone;
            if (dto.Address is not null) profile.Address = dto.Address;
            if (dto.EmergencyContact is not null) profile.EmergencyContact = dto.EmergencyContact;
            if (dto.EmergencyPhone is not null) profile.EmergencyPhone = dto.EmergencyPhone;
            if (dto.ChronicDiseases is not null) profile.ChronicDiseasesJson = JsonSerializer.Serialize(dto.ChronicDiseases);
            if (dto.Allergies is not null) profile.AllergiesJson = JsonSerializer.Serialize(dto.Allergies);
            if (dto.CurrentMedications is not null) profile.CurrentMedicationsJson = JsonSerializer.Serialize(dto.CurrentMedications);
            profile.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم حفظ بيانات الملف الطبي" });
        }

        [HttpPost("me/photo")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            if (file is null || file.Length == 0) return BadRequest("لم يتم اختيار صورة");
            if (file.Length > 5 * 1024 * 1024) return BadRequest("حجم الصورة أكبر من 5 ميجا");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            if (!allowed.Contains(ext)) return BadRequest("صيغة الصورة غير مدعومة");

            var folder = Path.Combine(_env.WebRootPath, "uploads", "patients");
            Directory.CreateDirectory(folder);
            var fileName = $"{UserId}-{Guid.NewGuid():N}{ext}";
            var fullPath = Path.Combine(folder, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
                await file.CopyToAsync(stream);

            return Ok(new { url = $"/uploads/patients/{fileName}" });
        }

        private async Task<IActionResult> BuildDto(int patientId)
        {
            var patient = await _context.Patients
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == patientId);
            if (patient is null) return NotFound();

            var profile = await _context.PatientProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.PatientId == patientId);

            return Ok(new PatientProfileDto(
                patient.Id,
                patient.FullName,
                profile?.PhotoUrl ?? string.Empty,
                profile?.BloodType ?? string.Empty,
                profile?.DateOfBirth,
                profile?.Gender ?? string.Empty,
                profile?.Phone ?? string.Empty,
                profile?.Address ?? string.Empty,
                profile?.EmergencyContact ?? string.Empty,
                profile?.EmergencyPhone ?? string.Empty,
                DeserializeList(profile?.ChronicDiseasesJson),
                DeserializeList(profile?.AllergiesJson),
                DeserializeList(profile?.CurrentMedicationsJson)));
        }

        private static List<string> DeserializeList(string? json)
        {
            if (string.IsNullOrWhiteSpace(json)) return new List<string>();
            try { return JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>(); }
            catch { return new List<string>(); }
        }
    }
}