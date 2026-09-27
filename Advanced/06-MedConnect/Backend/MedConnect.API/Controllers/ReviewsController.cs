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
    public class ReviewsController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public ReviewsController(IAppDbContext context) { _context = context; }

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("doctor/{doctorId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByDoctor(string doctorId)
        {
            var items = await _context.Reviews
                .AsNoTracking()
                .Include(r => r.Patient)
                .Where(r => r.DoctorId == doctorId && r.IsVisible)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(items.Select(Map));
        }

        [HttpGet("doctor/{doctorId}/summary")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSummary(string doctorId)
        {
            var reviews = await _context.Reviews
                .AsNoTracking()
                .Where(r => r.DoctorId == doctorId && r.IsVisible)
                .ToListAsync();

            var dist = new Dictionary<int, int>
            {
                { 1, 0 }, { 2, 0 }, { 3, 0 }, { 4, 0 }, { 5, 0 }
            };

            foreach (var r in reviews)
            {
                var key = Math.Clamp(r.Rating, 1, 5);
                dist[key] = dist.GetValueOrDefault(key) + 1;
            }

            var avg = reviews.Count > 0 ? reviews.Average(r => r.Rating) : 0;

            return Ok(new ReviewSummaryDto(doctorId, Math.Round(avg, 2), reviews.Count, dist));
        }

        [HttpGet("my")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetMine()
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == UserId);
            if (patient is null) return NotFound();

            var items = await _context.Reviews
                .AsNoTracking()
                .Include(r => r.Patient)
                .Include(r => r.Doctor)
                .Where(r => r.PatientId == patient.Id)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(items.Select(Map));
        }

        [HttpPost]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> Create(CreateReviewDto dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5) return BadRequest("التقييم يجب أن يكون من 1 إلى 5");

            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == UserId);
            if (patient is null) return NotFound();

            var existing = await _context.Reviews
                .FirstOrDefaultAsync(r => r.DoctorId == dto.DoctorId
                                       && r.PatientId == patient.Id
                                       && r.AppointmentId == dto.AppointmentId);
            if (existing is not null) return BadRequest("لديك تقييم لهذا الطبيب بالفعل");

            var review = new Review
            {
                DoctorId = dto.DoctorId,
                PatientId = patient.Id,
                AppointmentId = dto.AppointmentId,
                Rating = dto.Rating,
                Comment = dto.Comment ?? string.Empty
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { review.Id });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> Delete(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review is null) return NotFound();

            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == UserId);
            if (patient is null || review.PatientId != patient.Id) return Forbid();

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم حذف التقييم" });
        }

        private static ReviewDto Map(Review r) => new(
            r.Id,
            r.DoctorId,
            r.Doctor?.FullName ?? string.Empty,
            r.PatientId,
            r.Patient?.FullName ?? string.Empty,
            r.Rating,
            r.Comment,
            r.CreatedAt);
    }
}