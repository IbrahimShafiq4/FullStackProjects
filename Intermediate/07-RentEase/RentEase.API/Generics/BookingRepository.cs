using Microsoft.EntityFrameworkCore;
using RentEase.API.Data;
using RentEase.API.Models;

namespace RentEase.API.Generics
{
    public interface IBookingRepository
    {
        Task<bool> EquipmentHasActiveBookingsAsync(int equipmentId);
        Task AddAsync(Booking booking);
        void Remove(Booking booking);

        Task<Booking?> GetByIdWithDetailsAsync(int id);
        Task<List<Booking>> GetByRenterAsync(string renterId);
        Task<List<Booking>> GetIncomingForOwnerAsync(string ownerId);
    }

    public class BookingRepository : IBookingRepository
    {
        private readonly AppDbContext _context;

        public BookingRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<bool> EquipmentHasActiveBookingsAsync(int equipmentId)
        {
            return await _context.Bookings
                .AnyAsync(b => b.EquipmentId == equipmentId
                            && (b.Status == BookingStatus.Pending
                             || b.Status == BookingStatus.Confirmed));
        }

        public async Task AddAsync(Booking booking)
        {
            await _context.Bookings.AddAsync(booking);
        }

        public void Remove(Booking booking)
        {
            _context.Bookings.Remove(booking);
        }

        public async Task<Booking?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.Bookings
                .Include(b => b.Equipment)
                    .ThenInclude(e => e.Owner)
                .Include(b => b.Renter)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<List<Booking>> GetByRenterAsync(string renterId)
        {
            return await _context.Bookings
                .AsNoTracking()
                .Include(b => b.Equipment)
                    .ThenInclude(e => e.Owner)
                .Include(b => b.Renter)
                .Where(b => b.RenterId == renterId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Booking>> GetIncomingForOwnerAsync(string ownerId)
        {
            return await _context.Bookings
                .AsNoTracking()
                .Include(b => b.Equipment)
                    .ThenInclude(e => e.Owner)
                .Include(b => b.Renter)
                .Where(b => b.Equipment.OwnerId == ownerId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }
    }
}