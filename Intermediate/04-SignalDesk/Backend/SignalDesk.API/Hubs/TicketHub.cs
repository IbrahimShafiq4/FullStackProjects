using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace SignalDesk.API.Hubs
{
    [Authorize]
    public class TicketHub: Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;

            var ticketId = Context.GetHttpContext()?.Request.Query["ticketId"];
            if (!string.IsNullOrEmpty(ticketId)) { await Groups.AddToGroupAsync(Context.ConnectionId, $"ticket-{ticketId}"); }

            await base.OnConnectedAsync();
        }

        public async Task MarkAsRead(int messageId) { await Clients.Group(Context.ConnectionId).SendAsync("MessageRead", messageId); }
    }
}
