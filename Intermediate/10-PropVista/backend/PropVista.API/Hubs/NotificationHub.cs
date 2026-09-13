using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace PropVista.API.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?
                .FindFirstValue(ClaimTypes.NameIdentifier);

            Console.WriteLine("=================================");
            Console.WriteLine("🔔 NotificationHub Connected");
            Console.WriteLine($"Connection ID: {Context.ConnectionId}");
            Console.WriteLine($"User ID: {userId}");

            if (!string.IsNullOrEmpty(userId))
            {
                var groupName = $"user-{userId}";

                await Groups.AddToGroupAsync(
                    Context.ConnectionId,
                    groupName);

                Console.WriteLine(
                    $"✅ Added to group: {groupName}"
                );
            }
            else
            {
                Console.WriteLine(
                    "❌ User ID was not found in SignalR claims"
                );
            }

            Console.WriteLine("=================================");

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(
            Exception? exception)
        {
            Console.WriteLine(
                $"🔌 NotificationHub disconnected: {Context.ConnectionId}"
            );

            await base.OnDisconnectedAsync(exception);
        }
    }
}