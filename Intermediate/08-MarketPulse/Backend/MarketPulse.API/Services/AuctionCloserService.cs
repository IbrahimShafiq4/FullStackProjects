using MarketPulse.API.Data;
using MarketPulse.API.Hubs;
using MarketPulse.API.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace MarketPulse.API.Services
{
    public class AuctionCloserService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<AuctionCloserService> _logger;

        public AuctionCloserService(IServiceProvider serviceProvider, ILogger<AuctionCloserService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CloseExpiredAuctionsAsync();
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }

        private async Task CloseExpiredAuctionsAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<AuctionHub>>();

            var expiredAuctions = await context.Auctions
                .Where(a => a.Status == AuctionStatus.Active && a.EndsAt <= DateTime.UtcNow)
                .Include(a => a.Winner)
                .ToListAsync();

            foreach (var auction in expiredAuctions)
            {
                auction.Status = AuctionStatus.Closed;
                var winnerName = auction.Winner?.FullName ?? "لا يوجد فائز";
                _logger.LogInformation("تم إغلاق المزاد {AuctionId}", auction.Id);

                await hubContext.Clients.Group($"auction-{auction.Id}")
                    .SendAsync("AuctionClosed", new
                    {
                        auction.Id,
                        WinnerId = auction.WinnerId,
                        WinnerName = winnerName
                    });
            }

            if (expiredAuctions.Any())
                await context.SaveChangesAsync();
        }
    }
}