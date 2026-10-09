using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using R_FIT.Application.Interfaces;
using R_FIT.Domain.Entities;
using R_FIT.Infrastructure.Hubs;
using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Infrastructure.Services
{
    public interface INotificationService
    {
        Task SendAsync(string recipientId, NotificationType type, string message, int? posId = null);
    }

    public class NotificationService: INotificationService
    {
        private readonly IAppDbContext                  _context;
        private readonly IHubContext<NotificationHub>   _hubContext;
        private readonly IUserConnectionTracker         _tracker;

        public NotificationService
        (
            IAppDbContext                   context,
            IHubContext<NotificationHub>    hubContext,
            IUserConnectionTracker          tracker
        )
        {
            _context    = context;
            _hubContext = hubContext;
            _tracker    = tracker;
        }

        public async Task SendAsync(string recipientId, NotificationType type, string message, int? postId = null)
        {
            var notification = new Notification 
            { 
                RecipientId     = recipientId, 
                Type            = type, 
                Message         = message, 
                RelatedPostId   = postId 
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            var inSilentMode = await _context.SilentModes
                            .AnyAsync(s => 
                                s.UserId == recipientId && 
                                s.EndsAt > DateTime.UtcNow
                            );
            if (inSilentMode) return;

            var quiet = await _context.QuietHoursSettings.FirstOrDefaultAsync(q => q.UserId == recipientId && q.IsEnabled);
            if (quiet != null && IsWithinQuietHours(quiet.StartTime, quiet.EndTime)) return;

            if (!_tracker.IsOnline(recipientId)) return;

            await _hubContext.Clients.Group($"user-{recipientId}").SendAsync("NewNotification", new
            {
                notification.Id,
                notification.Message,
                Type = notification.Type.ToString(),
                notification.CreatedAt,
                notification.RelatedPostId
            });
        }

        private static bool IsWithinQuietHours(TimeSpan start, TimeSpan end)
        {
            var now = DateTime.UtcNow.TimeOfDay;
            return start < end ? (now >= start && now <= end) : (now >= start || now <= end);
        }
    }
}
