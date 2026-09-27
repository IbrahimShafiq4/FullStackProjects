using System.Text.Json;
using MedConnect.Application.Features;
using MedConnect.Application.Interfaces;
using MedConnect.Domain.Entities;
using MedConnect.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PrescriptionsController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly IPrescriptionPdfService _pdfService;
        private readonly IWebHostEnvironment _env;

        public PrescriptionsController(
                IAppDbContext context,
                IPrescriptionPdfService pdfService,
                IWebHostEnvironment env
            )
        {
            _context = context; _pdfService = pdfService; _env = env;
        }

        [HttpPost("appointment/{appointmentId}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> IssuePrescription(int appointmentId, CreatePrescriptionDto dto)
        {
            var appointment = await _context.Appointments
                        .Include(a => a.Doctor)
                        .Include(a => a.Patient)
                        .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment is null) return NotFound();

            var medications = dto.Medications ?? new List<PrescriptionMedicationDto>();

            var pdfUrl = await _pdfService.GenerateAsync(
                appointment.Patient.FullName,
                appointment.Doctor.FullName,
                appointment.Doctor.Specialty,
                medications,
                dto.Notes ?? string.Empty,
                _env
            );

            var json = JsonSerializer.Serialize(medications);

            var prescription = new Prescription
            {
                AppointmentId = appointmentId,
                MedicationsJson = json,
                Notes = dto.Notes ?? string.Empty,
                PdfUrl = pdfUrl
            };

            _context.Prescriptions.Add(prescription);
            appointment.Status = Domain.Enums.AppointmentStatus.Completed;
            await _context.SaveChangesAsync();

            return Ok(new { prescription.PdfUrl });
        }
    }
}