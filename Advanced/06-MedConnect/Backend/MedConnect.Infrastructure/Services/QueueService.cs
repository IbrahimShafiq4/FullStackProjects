using MedConnect.Application.Features;
using MedConnect.Application.Interfaces;
using MedConnect.Domain.Entities;
using MedConnect.Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace MedConnect.Infrastructure.Services
{
    public interface IQueueService
    {
        Task<QueueTicketDto> IssueTicketAsync(string doctorId, int patientId, int? appointmentId);
        Task<QueueTicketDto?> CallNextAsync(string doctorId);
        Task<QueueTicketDto?> CallTicketAsync(int ticketId);
        Task<QueueTicketDto?> CompleteTicketAsync(int ticketId);
        Task<QueueStatusDto> GetQueueAsync(string doctorId);
    }

    public class QueueService : IQueueService
    {
        private readonly IAppDbContext _context;
        private readonly IHubContext<QueueHub> _queueHub;
        private readonly INotificationService _notifications;

        public QueueService(
            IAppDbContext context,
            IHubContext<QueueHub> queueHub,
            INotificationService notifications)
        {
            _context = context;
            _queueHub = queueHub;
            _notifications = notifications;
        }

        public async Task<QueueTicketDto> IssueTicketAsync(string doctorId, int patientId, int? appointmentId)
        {
            var today = DateTime.UtcNow.Date;

            var lastNumber = await _context.QueueTickets
                .Where(q => q.DoctorId == doctorId && q.IssuedAt >= today)
                .OrderByDescending(q => q.TicketNumber)
                .Select(q => (int?)q.TicketNumber)
                .FirstOrDefaultAsync() ?? 0;

            var ticket = new QueueTicket
            {
                DoctorId = doctorId,
                PatientId = patientId,
                AppointmentId = appointmentId,
                TicketNumber = lastNumber + 1,
                Status = QueueStatus.Waiting,
                IssuedAt = DateTime.UtcNow
            };

            _context.QueueTickets.Add(ticket);
            await _context.SaveChangesAsync();

            var patientUser = await _context.Patients
                .Where(p => p.Id == patientId)
                .Select(p => p.UserId)
                .FirstOrDefaultAsync();

            if (!string.IsNullOrEmpty(patientUser))
            {
                await _notifications.PushAsync(
                    patientUser,
                    NotificationType.SystemMessage,
                    "تم تسجيلك في الدور",
                    $"رقم دورك {ticket.TicketNumber}",
                    $"/queue/{doctorId}");
            }

            await BroadcastQueueAsync(doctorId);
            return (await BuildDtoAsync(ticket.Id))!;
        }

        public async Task<QueueTicketDto?> CallNextAsync(string doctorId)
        {
            var next = await _context.QueueTickets
                .Where(q => q.DoctorId == doctorId && q.Status == QueueStatus.Waiting)
                .OrderBy(q => q.TicketNumber)
                .FirstOrDefaultAsync();

            if (next is null) return null;
            return await CallTicketAsync(next.Id);
        }

        public async Task<QueueTicketDto?> CallTicketAsync(int ticketId)
        {
            var ticket = await _context.QueueTickets
                .Include(q => q.Patient)
                .FirstOrDefaultAsync(q => q.Id == ticketId);

            if (ticket is null) return null;

            var previous = await _context.QueueTickets
                .Where(q => q.DoctorId == ticket.DoctorId
                         && q.Status == QueueStatus.Called
                         && q.Id != ticket.Id)
                .ToListAsync();

            foreach (var p in previous)
            {
                p.Status = QueueStatus.Completed;
                p.CompletedAt = DateTime.UtcNow;
            }

            ticket.Status = QueueStatus.Called;
            ticket.CalledAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var patientUser = await _context.Patients
                .Where(p => p.Id == ticket.PatientId)
                .Select(p => p.UserId)
                .FirstOrDefaultAsync();

            if (!string.IsNullOrEmpty(patientUser))
            {
                await _notifications.PushAsync(
                    patientUser,
                    NotificationType.QueueCalled,
                    "دورك الآن",
                    $"الدكتور جاهز لاستقبالك — رقم دورك {ticket.TicketNumber}",
                    $"/queue/{ticket.DoctorId}");
            }

            var remaining = await _context.QueueTickets
                .Where(q => q.DoctorId == ticket.DoctorId && q.Status == QueueStatus.Waiting)
                .OrderBy(q => q.TicketNumber)
                .Take(3)
                .ToListAsync();

            foreach (var r in remaining)
            {
                var nextUser = await _context.Patients
                    .Where(p => p.Id == r.PatientId)
                    .Select(p => p.UserId)
                    .FirstOrDefaultAsync();

                if (!string.IsNullOrEmpty(nextUser))
                {
                    await _notifications.PushAsync(
                        nextUser,
                        NotificationType.QueueNext,
                        "استعد للدور",
                        $"باقي {r.TicketNumber - ticket.TicketNumber} حالات قبلك",
                        $"/queue/{ticket.DoctorId}");
                }
            }

            await BroadcastQueueAsync(ticket.DoctorId);
            return await BuildDtoAsync(ticket.Id);
        }

        public async Task<QueueTicketDto?> CompleteTicketAsync(int ticketId)
        {
            var ticket = await _context.QueueTickets.FindAsync(ticketId);
            if (ticket is null) return null;

            ticket.Status = QueueStatus.Completed;
            ticket.CompletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            await BroadcastQueueAsync(ticket.DoctorId);
            return await BuildDtoAsync(ticket.Id);
        }

        public async Task<QueueStatusDto> GetQueueAsync(string doctorId)
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            var todayTickets = await _context.QueueTickets
                .Include(q => q.Patient)
                .Include(q => q.Doctor)
                .Where(q => q.DoctorId == doctorId
                         && q.IssuedAt >= today
                         && q.IssuedAt < tomorrow)
                .OrderBy(q => q.TicketNumber)
                .ToListAsync();

            var waiting = todayTickets
                .Where(q => q.Status == QueueStatus.Waiting)
                .ToList();

            var current = todayTickets
                .FirstOrDefault(q => q.Status == QueueStatus.Called);

            var ticketAppointmentIds = todayTickets
                .Where(t => t.AppointmentId.HasValue)
                .Select(t => t.AppointmentId!.Value)
                .ToHashSet();

            var todayAppointments = await _context.Appointments
                .AsNoTracking()
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .Where(a => a.DoctorId == doctorId
                         && a.Status == Domain.Enums.AppointmentStatus.Booked
                         && a.ScheduledAt >= today
                         && a.ScheduledAt < tomorrow
                         && !ticketAppointmentIds.Contains(a.Id))
                .OrderBy(a => a.ScheduledAt)
                .ToListAsync();

            var todayAppointmentDtos = todayAppointments
                .Select(a => new AppointmentDto(
                    a.Id,
                    a.ScheduledAt,
                    a.Status.ToString(),
                    a.DoctorId,
                    a.Doctor?.FullName ?? string.Empty,
                    a.Patient?.FullName ?? string.Empty,
                    a.PatientComplaint))
                .ToList();

            return new QueueStatusDto(
                doctorId,
                waiting.Count,
                current?.TicketNumber ?? 0,
                current is null ? null : Map(current),
                waiting.Select(Map).ToList(),
                todayTickets.Select(Map).ToList(),
                todayAppointmentDtos);
        }

        private async Task BroadcastQueueAsync(string doctorId)
        {
            var status = await GetQueueAsync(doctorId);
            await _queueHub.Clients
                .Group($"queue-doctor-{doctorId}")
                .SendAsync("QueueUpdated", status);
        }

        private async Task<QueueTicketDto?> BuildDtoAsync(int id)
        {
            var t = await _context.QueueTickets
                .Include(q => q.Patient)
                .Include(q => q.Doctor)
                .FirstOrDefaultAsync(q => q.Id == id);
            return t is null ? null : Map(t);
        }

        private static QueueTicketDto Map(QueueTicket t) => new(
            t.Id,
            t.TicketNumber,
            t.Status.ToString(),
            t.IssuedAt,
            t.CalledAt,
            t.PatientId,
            t.Patient?.FullName ?? string.Empty,
            t.DoctorId,
            t.Doctor?.FullName ?? string.Empty,
            t.Doctor?.Specialty ?? string.Empty,
            t.AppointmentId);
    }
}