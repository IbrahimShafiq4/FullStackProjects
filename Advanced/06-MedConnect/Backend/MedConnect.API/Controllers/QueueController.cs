using MedConnect.Application.Interfaces;
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
    public class QueueController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly IQueueService _queueService;

        public QueueController(IAppDbContext context, IQueueService queueService)
        {
            _context = context;
            _queueService = queueService;
        }

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("doctor/{doctorId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetQueue(string doctorId)
        {
            var status = await _queueService.GetQueueAsync(doctorId);
            return Ok(status);
        }

        [HttpGet("my-status/{doctorId}")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> MyStatus(string doctorId)
        {
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == UserId);
            if (patient is null) return NotFound();

            var ticket = await _context.QueueTickets
                .Where(q => q.DoctorId == doctorId
                         && q.PatientId == patient.Id
                         && (q.Status == Domain.Entities.QueueStatus.Waiting
                          || q.Status == Domain.Entities.QueueStatus.Called))
                .OrderByDescending(q => q.IssuedAt)
                .FirstOrDefaultAsync();

            if (ticket is null) return Ok(new { hasTicket = false });

            var waitingBefore = await _context.QueueTickets
                .CountAsync(q => q.DoctorId == doctorId
                              && q.Status == Domain.Entities.QueueStatus.Waiting
                              && q.TicketNumber < ticket.TicketNumber);

            return Ok(new
            {
                hasTicket = true,
                ticketNumber = ticket.TicketNumber,
                status = ticket.Status.ToString(),
                waitingBefore,
                issuedAt = ticket.IssuedAt,
                calledAt = ticket.CalledAt
            });
        }

        [HttpPost("join/{doctorId}")]
        [Authorize]
        public async Task<IActionResult> Join(string doctorId, [FromQuery] int? appointmentId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

            if (role == "Doctor" && doctorId != userId) return Forbid();

            int patientId;

            if (role == "Doctor")
            {
                if (!appointmentId.HasValue) return BadRequest("مطلوب تحديد المريض");
                var apt = await _context.Appointments.FindAsync(appointmentId.Value);
                if (apt is null) return NotFound("الموعد غير موجود");
                patientId = apt.PatientId;
            }
            else
            {
                var patient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.UserId == userId);
                if (patient is null) return BadRequest("بيانات المريض غير موجودة");
                patientId = patient.Id;
            }

            var existing = await _context.QueueTickets
                .Where(q => q.DoctorId == doctorId
                         && q.PatientId == patientId
                         && (q.Status == Domain.Entities.QueueStatus.Waiting
                          || q.Status == Domain.Entities.QueueStatus.Called))
                .FirstOrDefaultAsync();

            if (existing is not null) return Ok(existing);

            var ticket = await _queueService.IssueTicketAsync(doctorId, patientId, appointmentId);
            return Ok(ticket);
        }

        [HttpPost("call-next/{doctorId}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> CallNext(string doctorId)
        {
            if (doctorId != UserId) return Forbid();
            var ticket = await _queueService.CallNextAsync(doctorId);
            if (ticket is null) return Ok(new { message = "لا يوجد مرضى في الانتظار" });
            return Ok(ticket);
        }

        [HttpPost("call/{ticketId}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> CallTicket(int ticketId)
        {
            var ticket = await _queueService.CallTicketAsync(ticketId);
            if (ticket is null) return NotFound();
            return Ok(ticket);
        }

        [HttpPost("complete/{ticketId}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> Complete(int ticketId)
        {
            var ticket = await _queueService.CompleteTicketAsync(ticketId);
            if (ticket is null) return NotFound();
            return Ok(ticket);
        }
    }
}