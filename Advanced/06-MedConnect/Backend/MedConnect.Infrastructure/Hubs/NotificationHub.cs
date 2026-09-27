using Microsoft.AspNetCore.SignalR;

namespace MedConnect.Infrastructure.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task JoinUserChannel(string userId) =>
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
    }
}