using EventSphere.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Infrastructure.BackgroundServices
{
    public class SeatLockCleanupService: BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        public SeatLockCleanupService(IServiceProvider serviceProvider)
        { _serviceProvider = serviceProvider; }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while(!stoppingToken.IsCancellationRequested)
            {
                using var scope = _serviceProvider.CreateScope();
                var lockingService = scope.ServiceProvider.GetRequiredService<ISeatLockingService>();
                await lockingService.ReleaseExpiredLocksAsync();
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }
    }
}
