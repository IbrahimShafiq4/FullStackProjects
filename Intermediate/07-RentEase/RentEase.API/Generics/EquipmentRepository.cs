using Microsoft.EntityFrameworkCore;
using RentEase.API.Data;
using RentEase.API.Models;

namespace RentEase.API.Generics
{
    public interface IEquipmentRepository : IGenericRepository<Equipment>
    {
        Task<bool> HasOverlappingBookingAsync(int equipmentId, DateTime start, DateTime end, int? excludeBookingId = null);
        Task<List<Equipment>>   GetByOwnerAsync(string ownerId);
        Task<Equipment?>        GetByIdWithOwnerAsync(int id);
    }

    public class EquipmentRepository : GenericRepository<Equipment>, IEquipmentRepository
    {
        public EquipmentRepository(AppDbContext context) : base(context) { }

        public async Task<bool> HasOverlappingBookingAsync(int equipmentId, DateTime start, DateTime end, int? excludeBookingId = null) =>
            await _context.Bookings.AnyAsync(b =>
                b.EquipmentId == equipmentId &&
                b.Status != BookingStatus.Cancelled &&
                b.Status != BookingStatus.Rejected &&
                (excludeBookingId == null || b.Id != excludeBookingId) &&
                b.StartDate < end && b.EndDate > start);

        public async Task<List<Equipment>> GetByOwnerAsync(string ownerId) =>
            await _dbset.Where(e => e.OwnerId == ownerId)
                        .OrderByDescending(e => e.CreatedAt)
                        .ToListAsync();

        public async Task<Equipment?> GetByIdWithOwnerAsync(int id) =>
            await _dbset.Include(e => e.Owner).FirstOrDefaultAsync(e => e.Id == id);
    }
}