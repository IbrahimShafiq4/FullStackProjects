using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MarketPulse.API.Hubs
{
    [Authorize]
    public class AuctionHub: Hub
    {
        public override async Task OnConnectedAsync()
        {
            var auctionId = Context.GetHttpContext()?.Request.Query["auctionI"];
            if (!string.IsNullOrEmpty(auctionId)) 
                await Groups.AddToGroupAsync(Context.ConnectionId, $"auction-{auctionId}");
            await base.OnConnectedAsync();
        }
    }
}
