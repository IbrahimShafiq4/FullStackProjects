using MedConnect.Application.Interfaces;
using MedConnect.Domain.Entities;
using MedConnect.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace MedConnect.Infrastructure.Services
{
    public class AppointmentReminderService : BackgroundService
    {
        private readonly IServiceProvider _services;
        private readonly ILogger<AppointmentReminderService> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(10);

        public AppointmentReminderService(
            IServiceProvider services,
            ILogger<AppointmentReminderService> logger)
        {
            _services = services;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await Task.Delay(TimeSpan.FromSeconds(20), stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessRemindersAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Appointment reminder cycle failed");
                }

                await Task.Delay(_interval, stoppingToken);
            }
        }

        private async Task ProcessRemindersAsync(CancellationToken ct)
        {
            using var scope = _services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<IAppDbContext>();
            var notifications = scope.ServiceProvider.GetRequiredService<INotificationService>();

            var now = DateTime.UtcNow;
            var todayStart = now.Date;
            var todayEnd = todayStart.AddDays(1);
            var tomorrowStart = todayStart.AddDays(1);
            var tomorrowEnd = todayStart.AddDays(2);

            var dayBefore = await context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .Where(a => a.Status == AppointmentStatus.Booked
                         && !a.DayBeforeReminderSent
                         && a.ScheduledAt >= tomorrowStart
                         && a.ScheduledAt < tomorrowEnd)
                .ToListAsync(ct);

            foreach (var apt in dayBefore)
            {
                var user = await context.Patients
                    .Where(p => p.Id == apt.PatientId)
                    .Select(p => p.UserId)
                    .FirstOrDefaultAsync(ct);

                if (!string.IsNullOrEmpty(user))
                {
                    await notifications.PushAsync(
                        user,
                        NotificationType.AppointmentSoon,
                        "موعدك غداً",
                        $"لديك استشارة مع د. {apt.Doctor.FullName} غداً الساعة {apt.ScheduledAt.ToLocalTime():HH:mm}",
                        "/my-appointments");
                }

                apt.DayBeforeReminderSent = true;
            }

            var dayOf = await context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .Where(a => a.Status == AppointmentStatus.Booked
                         && !a.DayOfReminderSent
                         && a.ScheduledAt >= todayStart
                         && a.ScheduledAt < todayEnd
                         && a.ScheduledAt > now)
                .ToListAsync(ct);

            foreach (var apt in dayOf)
            {
                var user = await context.Patients
                    .Where(p => p.Id == apt.PatientId)
                    .Select(p => p.UserId)
                    .FirstOrDefaultAsync(ct);

                if (!string.IsNullOrEmpty(user))
                {
                    var minutes = (int)Math.Round((apt.ScheduledAt - now).TotalMinutes);
                    var whenText = minutes <= 60
                        ? $"بعد {minutes} دقيقة"
                        : $"الساعة {apt.ScheduledAt.ToLocalTime():HH:mm}";

                    await notifications.PushAsync(
                        user,
                        NotificationType.AppointmentSoon,
                        "استشارتك اليوم",
                        $"تذكير: استشارتك مع د. {apt.Doctor.FullName} اليوم {whenText}",
                        "/my-appointments");
                }

                apt.DayOfReminderSent = true;
            }

            if (dayBefore.Count > 0 || dayOf.Count > 0)
            {
                await context.SaveChangesAsync(ct);
                _logger.LogInformation(
                    "Reminders sent — before: {Before}, of-day: {OfDay}",
                    dayBefore.Count, dayOf.Count);
            }
        }
    }
}