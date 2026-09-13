using Microsoft.EntityFrameworkCore;
using PropVista.API.Data;
using PropVista.API.Models;

namespace PropVista.API.Services
{
    public interface IViewingService
    {
        Task<(bool success, string? error, int? viewingId)> ScheduleViewingAsync(int propertyId, string seekerId, DateTime scheduledAt);
        Task<Property?> GetPropertyWithOwnerAsync(int propertyId);
    }

    public class ViewingService: IViewingService
    {
        private readonly    AppDbContext _context;
        private const       int          viewingDurationMinutes = 30;

        public ViewingService(AppDbContext context)
        { _context = context; }

        public async Task<(bool success, string? error, int? viewingId)> ScheduleViewingAsync(int propertyId, string seekerId, DateTime scheduledAt)
        {
            if (scheduledAt < DateTime.UtcNow) return (false, "لا يمكن حجز موعد فى الماضى.", null);

            var property = await _context.Properties.FindAsync(propertyId);
            if (property is null) return (false, "العقار غير موجود.", null);

            var windowStart = scheduledAt;
            var windowEnd = scheduledAt.AddMinutes(viewingDurationMinutes);

            var hasConflict = await _context.Viewings.AnyAsync(v =>
                v.PropertyId == propertyId &&
                v.Status == ViewingStatus.Scheduled &&
                v.ScheduledAt < windowEnd &&
                v.ScheduledAt.AddMinutes(viewingDurationMinutes) > windowStart);

            if (hasConflict) return (false, "هذا الموعد محجوز بالفغل، اختر وقتا آخر.", null);

            var viewing = new Viewing { PropertyId = propertyId, SeekerId = seekerId, ScheduledAt = scheduledAt };
            _context.Viewings.Add(viewing);
            await _context.SaveChangesAsync();

            return (true, null, viewing.Id);
        }

        public async Task<Property?> GetPropertyWithOwnerAsync(int propertyId)
        {
            return await _context.Properties
                .Include(p => p.Owner)
                .FirstOrDefaultAsync(p => p.Id == propertyId);
        }
    }
}
