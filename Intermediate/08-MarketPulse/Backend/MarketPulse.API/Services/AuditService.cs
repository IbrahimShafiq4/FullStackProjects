using MarketPulse.API.Data;
using MarketPulse.API.Models;

namespace MarketPulse.API.Services
{
    public interface IAuditService
    {
        Task LogAsync(string? userId, string action, string? ip);
    }

    public class AuditService : IAuditService
    {
        private readonly AppDbContext _context;
        public AuditService(AppDbContext context) => _context = context;

        public async Task LogAsync(string? userId, string action, string? ip)
        {
            _context.AuditLogs.Add(new AuditLog
            {
                UserId = userId,
                Action = action,
                IpAddress = ip,
                OccurredAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }
    }
}