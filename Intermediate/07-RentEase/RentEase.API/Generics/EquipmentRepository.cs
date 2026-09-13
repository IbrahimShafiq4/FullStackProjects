using Microsoft.EntityFrameworkCore;
using RentEase.API.Data;
using RentEase.API.Models;

namespace RentEase.API.Generics
{
    public interface IEquipmentRepository : IGenericRepository<Equipment>
    {
        Task<bool> HasOverlappingBookingAsync(int equipmentId, DateTime start, DateTime end);
    }
    public class EquipmentRepository : GenericRepository<Equipment>, IEquipmentRepository
    {
        public EquipmentRepository(AppDbContext context) : base(context) { }
        public async Task<bool> HasOverlappingBookingAsync(int equipmentId, DateTime start, DateTime end) =>
            await _context.Bookings.AnyAsync(b =>
                b.EquipmentId == equipmentId && b.Status != BookingStatus.Cancelled &&
                b.StartDate < end && b.EndDate > start);
    }
}
