using TalentBridgeAPI.Data;
using TalentBridgeAPI.Models;

namespace TalentBridgeAPI.Services
{
    public interface INotificationService 
    {
        Task NotifyAsync(string recipientId, string message);
    }

    public class NotificationService: INotificationService
    {
        private readonly AppDbContext _context;
        public NotificationService(AppDbContext context)
        { _context = context; }

        public async Task NotifyAsync(string resipientId, string message)
        {
            _context.Notifications.Add(new Notification { RecipientId = resipientId, Message = message });
            await _context.SaveChangesAsync();
        }
    }
}
