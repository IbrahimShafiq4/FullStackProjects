using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MarketPulse.API.Hubs
{
    [Authorize]
    public class AuctionHub : Hub
    {
        private readonly ILogger<AuctionHub> _logger;
        public AuctionHub(ILogger<AuctionHub> logger) => _logger = logger;

        public override async Task OnConnectedAsync()
        {
            var auctionId = Context.GetHttpContext()?.Request.Query["auctionId"].ToString();

            if (!string.IsNullOrWhiteSpace(auctionId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"auction-{auctionId}");
                _logger.LogInformation("Connection {ConnId} joined auction-{AuctionId}",
                    Context.ConnectionId, auctionId);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _logger.LogInformation("Connection {ConnId} disconnected", Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinAuction(int auctionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"auction-{auctionId}");
        }
    }
}