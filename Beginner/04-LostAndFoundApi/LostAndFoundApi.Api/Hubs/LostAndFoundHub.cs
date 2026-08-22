using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace LostAndFoundApi.Api.Hubs
{
    public class LostAndFoundHub : Hub
    {
        public async Task JoinItem(int itemId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"item-{itemId}");
        }

        public async Task LeaveItem(int itemId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"item-{itemId}");
        }
    }
}
