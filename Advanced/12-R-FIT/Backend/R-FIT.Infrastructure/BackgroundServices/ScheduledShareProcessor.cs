using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using R_FIT.Application.Interfaces;
using R_FIT.Domain.Entities;
using R_FIT.Infrastructure.Data;
using R_FIT.Infrastructure.Hubs;
using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Infrastructure.BackgroundServices
{
    public class ScheduledShareProcessor: BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        public ScheduledShareProcessor(IServiceProvider serviceProvider)
        { _serviceProvider = serviceProvider; }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while(!stoppingToken.IsCancellationRequested)
            {
                using var scope = _serviceProvider.CreateScope();
                var context     = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var hubContext  = scope.ServiceProvider.GetRequiredService<IHubContext<NotificationHub>>();

                var dueShares = await context.Shares
                                .Where(s => 
                                    s.ScheduledAt != null && 
                                    s.ScheduledAt <= DateTime.UtcNow
                                )
                                .ToListAsync();

                foreach (var share in dueShares)
                {
                    share.ScheduledAt = null;
                    await hubContext.Clients
                            .Group($"user-{share.SharedById}")
                            .SendAsync("SharePublished", 
                                new 
                                { 
                                    share.Id, 
                                    share.OriginalPostId 
                                }
                            );
                }

                if (dueShares.Any()) await context.SaveChangesAsync(stoppingToken);
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
