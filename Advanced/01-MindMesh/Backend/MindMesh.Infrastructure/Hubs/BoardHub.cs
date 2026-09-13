using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MindMesh.Infrastructure.Hubs
{
    [Authorize]
    public class BoardHub : Hub
    {
        public async Task JoinBoard(string boardId) =>
            await Groups.AddToGroupAsync(Context.ConnectionId, $"board-{boardId}");

        public async Task NotifyCardMoved(string boardId, int cardId, double x, double y) =>
            await Clients.OthersInGroup($"board-{boardId}").SendAsync("CardMoved", cardId, x, y);

        public async Task NotifyConnectionCreated(string boardId, int connectionId, int fromCardId, int toCardId, string color) =>
            await Clients.OthersInGroup($"board-{boardId}").SendAsync("ConnectionCreated", connectionId, fromCardId, toCardId, color);

        public async Task NotifyConnectionDeleted(string boardId, int connectionId) =>
            await Clients.OthersInGroup($"board-{boardId}").SendAsync("ConnectionDeleted", connectionId);
    }
}