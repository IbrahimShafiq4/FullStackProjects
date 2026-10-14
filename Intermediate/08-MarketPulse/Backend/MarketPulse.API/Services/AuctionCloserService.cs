using MarketPulse.API.Data;
using MarketPulse.API.Hubs;
using MarketPulse.API.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace MarketPulse.API.Services
{
    public class AuctionCloserService : BackgroundService
    {
        private readonly IServiceProvider _sp;
        private readonly ILogger<AuctionCloserService> _logger;

        public AuctionCloserService(IServiceProvider sp, ILogger<AuctionCloserService> logger)
        {
            _sp = sp;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var timer = new PeriodicTimer(TimeSpan.FromSeconds(30));

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CloseExpiredAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "AuctionCloser iteration failed");
                }

                if (!await timer.WaitForNextTickAsync(stoppingToken))
                    break;
            }
        }

        private async Task CloseExpiredAsync()
        {
            using var scope = _sp.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var hub = scope.ServiceProvider.GetRequiredService<IHubContext<AuctionHub>>();

            var now = DateTime.UtcNow;

            var expired = await context.Auctions
                .Where(a => a.Status == AuctionStatus.Active && a.EndsAt <= now)
                .Include(a => a.Winner)
                .ToListAsync();

            if (expired.Count == 0) return;

            foreach (var a in expired)
            {
                a.Status = AuctionStatus.Closed;
            }

            await context.SaveChangesAsync();

            foreach (var a in expired)
            {
                var winnerName = a.Winner?.FullName ?? "لا يوجد فائز";
                _logger.LogInformation("Closed auction {AuctionId}", a.Id);

                await hub.Clients.Group($"auction-{a.Id}")
                    .SendAsync("AuctionClosed", new
                    {
                        Id = a.Id,
                        WinnerId = a.WinnerId,
                        WinnerName = winnerName
                    });
            }
        }
    }
}