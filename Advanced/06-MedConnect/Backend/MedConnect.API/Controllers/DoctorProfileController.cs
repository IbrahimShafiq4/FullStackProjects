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
    public class DoctorProfileController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public DoctorProfileController(IAppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("{doctorId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProfile(string doctorId)
        {
            var doctor = await _context.Doctors
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == doctorId);
            if (doctor is null) return NotFound();

            var profile = await _context.DoctorProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.DoctorId == doctorId);

            var achievements = DeserializeList<AchievementDto>(profile?.AchievementsJson);
            var certificates = DeserializeList<CertificateDto>(profile?.CertificatesJson);
            var languages = DeserializeList<string>(profile?.LanguagesJson);

            return Ok(new DoctorProfileDto(
                doctor.Id,
                doctor.FullName,
                doctor.Specialty,
                profile?.PhotoUrl ?? string.Empty,
                profile?.Bio ?? string.Empty,
                profile?.YearsOfExperience ?? 0,
                profile?.ClinicName ?? string.Empty,
                profile?.ClinicAddress ?? string.Empty,
                profile?.ClinicPhone ?? string.Empty,
                profile?.ClinicHours ?? string.Empty,
                profile?.ExaminationFee ?? 0,
                profile?.ConsultationFee ?? 0,
                profile?.Currency ?? "EGP",
                achievements,
                certificates,
                languages));
        }

        [HttpGet("me")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetMine()
        {
            return await GetProfile(UserId);
        }

        [HttpPut("me")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateMine(UpdateDoctorProfileDto dto)
        {
            var profile = await _context.DoctorProfiles
                .FirstOrDefaultAsync(p => p.DoctorId == UserId);

            if (profile is null)
            {
                profile = new DoctorProfile { DoctorId = UserId };
                _context.DoctorProfiles.Add(profile);
            }

            if (dto.PhotoUrl is not null) profile.PhotoUrl = dto.PhotoUrl;
            if (dto.Bio is not null) profile.Bio = dto.Bio;
            if (dto.YearsOfExperience.HasValue) profile.YearsOfExperience = dto.YearsOfExperience.Value;
            if (dto.ClinicName is not null) profile.ClinicName = dto.ClinicName;
            if (dto.ClinicAddress is not null) profile.ClinicAddress = dto.ClinicAddress;
            if (dto.ClinicPhone is not null) profile.ClinicPhone = dto.ClinicPhone;
            if (dto.ClinicHours is not null) profile.ClinicHours = dto.ClinicHours;
            if (dto.ExaminationFee.HasValue) profile.ExaminationFee = dto.ExaminationFee.Value;
            if (dto.ConsultationFee.HasValue) profile.ConsultationFee = dto.ConsultationFee.Value;
            if (dto.Currency is not null) profile.Currency = dto.Currency;
            if (dto.Achievements is not null) profile.AchievementsJson = JsonSerializer.Serialize(dto.Achievements);
            if (dto.Certificates is not null) profile.CertificatesJson = JsonSerializer.Serialize(dto.Certificates);
            if (dto.Languages is not null) profile.LanguagesJson = JsonSerializer.Serialize(dto.Languages);
            profile.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم حفظ الملف الشخصي" });
        }

        [HttpPost("me/photo")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            if (file is null || file.Length == 0) return BadRequest("لم يتم اختيار صورة");
            if (file.Length > 5 * 1024 * 1024) return BadRequest("حجم الصورة أكبر من 5 ميجا");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            if (!allowed.Contains(ext)) return BadRequest("صيغة الصورة غير مدعومة");

            var folder = Path.Combine(_env.WebRootPath, "uploads", "doctors");
            Directory.CreateDirectory(folder);
            var fileName = $"{UserId}-{Guid.NewGuid():N}{ext}";
            var fullPath = Path.Combine(folder, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
                await file.CopyToAsync(stream);

            var url = $"/uploads/doctors/{fileName}";
            return Ok(new { url });
        }

        private static List<T> DeserializeList<T>(string? json)
        {
            if (string.IsNullOrWhiteSpace(json)) return new List<T>();
            try { return JsonSerializer.Deserialize<List<T>>(json) ?? new List<T>(); }
            catch { return new List<T>(); }
        }
    }
}