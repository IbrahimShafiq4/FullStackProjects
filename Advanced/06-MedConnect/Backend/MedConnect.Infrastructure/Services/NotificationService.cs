using MedConnect.Application.Features;
using MedConnect.Application.Interfaces;
using MedConnect.Domain.Entities;
using MedConnect.Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace MedConnect.Infrastructure.Services
{
    public interface INotificationService
    {
        Task PushAsync(string userId, NotificationType type, string title, string body, string link);
    }

    public class NotificationService : INotificationService
    {
        private readonly IAppDbContext _context;
        private readonly IHubContext<NotificationHub> _hub;

        public NotificationService(IAppDbContext context, IHubContext<NotificationHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        public async Task PushAsync(string userId, NotificationType type, string title, string body, string link)
        {
            var notification = new Notification
            {
                UserId = userId,
                Type = type,
                Title = title,
                Body = body,
                Link = link,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            var dto = new NotificationDto(
                notification.Id,
                notification.Type.ToString(),
                notification.Title,
                notification.Body,
                notification.Link,
                notification.IsRead,
                notification.CreatedAt);

            await _hub.Clients.Group($"user-{userId}").SendAsync("ReceiveNotification", dto);
        }
    }
}