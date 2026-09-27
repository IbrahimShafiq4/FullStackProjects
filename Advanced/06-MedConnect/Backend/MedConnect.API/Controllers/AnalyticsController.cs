using MedConnect.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public AnalyticsController(IAppDbContext context)
        { _context = context; }

        [HttpGet("doctor-dashboard")]
        public async Task<IActionResult> GetDoctorDashboard()
        {
            var doctorId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var totalAppointments = await _context.Appointments.CountAsync(a => a.DoctorId == doctorId);
            var completed = await _context.Appointments.CountAsync(a =>
                a.DoctorId == doctorId &&
                a.Status == Domain.Enums.AppointmentStatus.Completed
            );

            return Ok(new { totalAppointments, completed, completeRate = totalAppointments > 0 ? (double)completed / totalAppointments * 100 : 0,  });
        }
    }
}
