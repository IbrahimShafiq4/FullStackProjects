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
    public class MedicalRecordsController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public MedicalRecordsController(IAppDbContext context) { _context = context; }

        private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        private string Role => User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        [HttpGet("appointment/{appointmentId}")]
        public async Task<IActionResult> GetByAppointment(int appointmentId)
        {
            var record = await _context.MedicalRecords
                .AsNoTracking()
                .Include(m => m.Appointment)
                    .ThenInclude(a => a.Doctor)
                .Include(m => m.Appointment)
                    .ThenInclude(a => a.Patient)
                .Include(m => m.Stages)
                .FirstOrDefaultAsync(m => m.AppointmentId == appointmentId);

            if (record is null) return NotFound();
            return Ok(MapToDto(record));
        }

        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetByPatient(int patientId)
        {
            if (Role == "Patient")
            {
                var me = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == UserId);
                if (me is null || me.Id != patientId) return Forbid();
            }

            var records = await _context.MedicalRecords
                .AsNoTracking()
                .Include(m => m.Appointment).ThenInclude(a => a.Doctor)
                .Include(m => m.Appointment).ThenInclude(a => a.Patient)
                .Include(m => m.Stages)
                .Where(m => m.Appointment.PatientId == patientId)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            return Ok(records.Select(MapToDto));
        }

        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> Create(CreateMedicalRecordDto dto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == dto.AppointmentId);

            if (appointment is null) return NotFound();
            if (appointment.DoctorId != UserId) return Forbid();

            var existing = await _context.MedicalRecords
                .FirstOrDefaultAsync(m => m.AppointmentId == dto.AppointmentId);
            if (existing is not null) return BadRequest("يوجد سجل طبي لهذا الموعد مسبقاً");

            var record = new MedicalRecord
            {
                AppointmentId = dto.AppointmentId,
                ChiefComplaint = dto.ChiefComplaint ?? string.Empty,
                Diagnosis = dto.Diagnosis ?? string.Empty,
                ExaminationNotes = dto.ExaminationNotes ?? string.Empty,
                TreatmentPlan = dto.TreatmentPlan ?? string.Empty,
                FollowUpNotes = dto.FollowUpNotes ?? string.Empty,
                VitalsJson = JsonSerializer.Serialize(dto.Vitals ?? new Dictionary<string, string>())
            };

            _context.MedicalRecords.Add(record);
            await _context.SaveChangesAsync();

            return Ok(new { record.Id });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> Update(int id, UpdateMedicalRecordDto dto)
        {
            var record = await _context.MedicalRecords
                .Include(m => m.Appointment)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (record is null) return NotFound();
            if (record.Appointment.DoctorId != UserId) return Forbid();

            if (dto.ChiefComplaint is not null) record.ChiefComplaint = dto.ChiefComplaint;
            if (dto.Diagnosis is not null) record.Diagnosis = dto.Diagnosis;
            if (dto.ExaminationNotes is not null) record.ExaminationNotes = dto.ExaminationNotes;
            if (dto.TreatmentPlan is not null) record.TreatmentPlan = dto.TreatmentPlan;
            if (dto.FollowUpNotes is not null) record.FollowUpNotes = dto.FollowUpNotes;
            if (dto.Vitals is not null) record.VitalsJson = JsonSerializer.Serialize(dto.Vitals);
            record.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم تحديث السجل" });
        }

        [HttpPost("{id}/stages")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> AddStage(int id, CreateTreatmentStageDto dto)
        {
            var record = await _context.MedicalRecords
                .Include(m => m.Appointment)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (record is null) return NotFound();
            if (record.Appointment.DoctorId != UserId) return Forbid();

            var maxOrder = await _context.TreatmentStages
                .Where(s => s.MedicalRecordId == id)
                .Select(s => (int?)s.Order).MaxAsync() ?? 0;

            var stage = new TreatmentStage
            {
                MedicalRecordId = id,
                Order = maxOrder + 1,
                Title = dto.Title ?? string.Empty,
                Description = dto.Description ?? string.Empty,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Notes = dto.Notes ?? string.Empty,
                Status = TreatmentStageStatus.Pending
            };

            _context.TreatmentStages.Add(stage);
            await _context.SaveChangesAsync();
            return Ok(new { stage.Id });
        }

        [HttpPut("stages/{stageId}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateStage(int stageId, UpdateTreatmentStageDto dto)
        {
            var stage = await _context.TreatmentStages
                .Include(s => s.MedicalRecord).ThenInclude(m => m.Appointment)
                .FirstOrDefaultAsync(s => s.Id == stageId);
            if (stage is null) return NotFound();
            if (stage.MedicalRecord.Appointment.DoctorId != UserId) return Forbid();

            if (dto.Title is not null) stage.Title = dto.Title;
            if (dto.Description is not null) stage.Description = dto.Description;
            if (dto.Status is not null && Enum.TryParse<TreatmentStageStatus>(dto.Status, true, out var s2))
                stage.Status = s2;
            if (dto.StartDate.HasValue) stage.StartDate = dto.StartDate;
            if (dto.EndDate.HasValue) stage.EndDate = dto.EndDate;
            if (dto.Notes is not null) stage.Notes = dto.Notes;

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم تحديث المرحلة" });
        }

        [HttpDelete("stages/{stageId}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> DeleteStage(int stageId)
        {
            var stage = await _context.TreatmentStages
                .Include(s => s.MedicalRecord).ThenInclude(m => m.Appointment)
                .FirstOrDefaultAsync(s => s.Id == stageId);
            if (stage is null) return NotFound();
            if (stage.MedicalRecord.Appointment.DoctorId != UserId) return Forbid();

            _context.TreatmentStages.Remove(stage);
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم حذف المرحلة" });
        }

        private static MedicalRecordDto MapToDto(MedicalRecord m)
        {
            Dictionary<string, string> vitals;
            try { vitals = JsonSerializer.Deserialize<Dictionary<string, string>>(m.VitalsJson) ?? new(); }
            catch { vitals = new(); }

            return new MedicalRecordDto(
                m.Id,
                m.AppointmentId,
                m.Appointment.ScheduledAt,
                m.Appointment.Patient?.FullName ?? string.Empty,
                m.Appointment.Doctor?.FullName ?? string.Empty,
                m.ChiefComplaint,
                m.Diagnosis,
                m.ExaminationNotes,
                m.TreatmentPlan,
                m.FollowUpNotes,
                vitals,
                m.Stages
                    .OrderBy(s => s.Order)
                    .Select(s => new TreatmentStageDto(
                        s.Id, s.Order, s.Title, s.Description,
                        s.Status.ToString(), s.StartDate, s.EndDate, s.Notes))
                    .ToList(),
                m.CreatedAt,
                m.UpdatedAt);
        }
    }
}