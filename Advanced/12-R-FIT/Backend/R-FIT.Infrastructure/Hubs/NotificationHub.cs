using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Infrastructure.Hubs
{
    [Authorize]
    public class NotificationHub: Hub
    {
        private readonly IUserConnectionTracker     _tracker;
        private readonly ILogger<NotificationHub>   _logger;

        public NotificationHub(IUserConnectionTracker tracker, ILogger<NotificationHub> logger)
        { _tracker = tracker; _logger = logger; }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
                _tracker.AddConnection(userId, Context.ConnectionId);
                _logger.LogInformation("المستخدم {UserId} اتصل بالإشعارات (Connection: {ConnId})", userId, Context.ConnectionId);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                _tracker.RemoveConnection(userId, Context.ConnectionId);
                _logger.LogInformation("المستخدم {UserId} فصل من الإشعارات", userId);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task NotifyNotificationRead(int notificationId) 
        {
            var userId = Context.UserIdentifier;
            if (string.IsNullOrEmpty(userId)) return;

            await Clients.OthersInGroup($"user-{userId}").SendAsync("NotificationRead", notificationId);
        }

        public int GetOnlineUsersCount() => _tracker.OnlineUsersCount;

    }
}
