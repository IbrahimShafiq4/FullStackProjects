using RentEase.API.Data;
using RentEase.API.Generics;
using RentEase.API.Models;

namespace RentEase.API.Services
{
    public interface IBookingService { Task<(bool success, string? error)> CreateBookingAsync(int equipmentId, string renterId, DateTime start, DateTime end); }

    public class BookingService: IBookingService
    {
        private readonly IEquipmentRepository _equipmentRepository;
        private readonly AppDbContext _context;

        public BookingService(IEquipmentRepository equipmentRepository, AppDbContext context)
        {
            _equipmentRepository = equipmentRepository;
            _context = context;
        }

        public async Task<(bool success, string? error)> CreateBookingAsync(int equipmentId, string renterId, DateTime start, DateTime end)
        {
            if (start >= end) return (false, "تاريخ البداية يجب ان يكون قبل النهاية");
            if (start < DateTime.UtcNow.Date) return (false, "لا يمكن الحجز بتاريخ ماضٍ");

            var equipment = await _equipmentRepository.GetByIdAsync(equipmentId);
            if (equipment is null) return (false, "المعدة غير موجودة");
            if (!equipment.IsAvailable) return (false, "المعدة غير متاحة");

            if (await _equipmentRepository.HasOverlappingBookingAsync(equipmentId, start, end)) return (false, "محجوزة بالفعل فى هذه الفترة");

            _context.Bookings.Add(new Booking { EquipmentId = equipmentId, RenterId = renterId, StartDate = start, EndDate = end });
            await _context.SaveChangesAsync();

            return (true, null);
        }
    }
}
