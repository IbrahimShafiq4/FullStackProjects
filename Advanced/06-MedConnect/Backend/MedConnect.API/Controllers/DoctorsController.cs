using MedConnect.Application.Features;
using MedConnect.Application.Interfaces;
using MedConnect.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DoctorsController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public DoctorsController(IAppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetDoctors([FromQuery] string? specialty)
        {
            IQueryable<Doctor> query = _context.Doctors
                .AsNoTracking()
                .Where(d => _context.UserClaims.Any(c =>
                    c.UserId == d.Id &&
                    c.ClaimType == "Role" &&
                    c.ClaimValue == "Doctor"));

            if (!string.IsNullOrWhiteSpace(specialty))
            {
                var term = specialty.ToLower().Trim();
                query = query.Where(d => d.Specialty.ToLower().Trim().Contains(term));
            }

            var doctors = await query
                .Select(d => new DoctorDto(d.Id, d.FullName, d.Specialty))
                .ToListAsync();

            return Ok(doctors);
        }

        [HttpGet("featured")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFeatured([FromQuery] int take = 6)
        {
            if (take < 1) take = 6;
            if (take > 20) take = 20;

            var doctorIds = await _context.Doctors
                .Where(d => _context.UserClaims.Any(c =>
                    c.UserId == d.Id && c.ClaimType == "Role" && c.ClaimValue == "Doctor"))
                .Select(d => d.Id)
                .ToListAsync();

            var result = new List<FeaturedDoctorDto>();

            foreach (var id in doctorIds.Take(take))
            {
                var doctor = await _context.Doctors.AsNoTracking().FirstOrDefaultAsync(d => d.Id == id);
                if (doctor is null) continue;

                var profile = await _context.DoctorProfiles
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.DoctorId == id);

                var reviews = await _context.Reviews
                    .AsNoTracking()
                    .Where(r => r.DoctorId == id && r.IsVisible)
                    .ToListAsync();

                var avg = reviews.Count > 0 ? Math.Round(reviews.Average(r => r.Rating), 2) : 0;

                result.Add(new FeaturedDoctorDto(
                    doctor.Id,
                    doctor.FullName,
                    doctor.Specialty,
                    profile?.PhotoUrl ?? string.Empty,
                    profile?.YearsOfExperience ?? 0,
                    profile?.ExaminationFee ?? 0,
                    profile?.Currency ?? "EGP",
                    avg,
                    reviews.Count));
            }

            return Ok(result
                .OrderByDescending(d => d.AverageRating)
                .ThenByDescending(d => d.TotalReviews)
                .ToList());
        }
    }
}