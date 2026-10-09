using RentEase.API.Data;
using RentEase.API.DTOs;
using RentEase.API.Generics;
using RentEase.API.Models;

namespace RentEase.API.Services
{
    public interface IBookingService
    {
        Task<(bool success, string? error, Booking? booking)> CreateBookingAsync(int equipmentId, string renterId, DateTime start, DateTime end);
        Task<List<BookingDto>> GetMyBookingsAsync(string renterId);
        Task<List<BookingDto>> GetIncomingBookingsAsync(string ownerId);
        Task<BookingDto?> GetBookingByIdAsync(int id, string userId);
        Task<(bool success, string? error)> ConfirmBookingAsync(int id, string ownerId);
        Task<(bool success, string? error)> RejectBookingAsync(int id, string ownerId, string? reason);
        Task<(bool success, string? error)> CancelBookingAsync(int id, string renterId);
        Task<(bool success, string? error)> DeleteBookingAsync(int id, string userId);
    }

    public class BookingService : IBookingService
    {
        private readonly IEquipmentRepository _equipmentRepository;
        private readonly IBookingRepository _bookingRepository;
        private readonly AppDbContext _context;

        public BookingService(
            IEquipmentRepository equipmentRepository,
            IBookingRepository bookingRepository,
            AppDbContext context)
        {
            _equipmentRepository = equipmentRepository;
            _bookingRepository = bookingRepository;
            _context = context;
        }

        public async Task<(bool success, string? error, Booking? booking)> CreateBookingAsync(
            int equipmentId, string renterId, DateTime start, DateTime end)
        {
            if (start >= end) return (false, "تاريخ البداية يجب ان يكون قبل النهاية", null);
            if (start < DateTime.UtcNow.Date) return (false, "لا يمكن الحجز بتاريخ ماضٍ", null);

            var equipment = await _equipmentRepository.GetByIdAsync(equipmentId);
            if (equipment is null) return (false, "المعدة غير موجودة", null);
            if (!equipment.IsAvailable) return (false, "المعدة غير متاحة", null);
            if (equipment.OwnerId == renterId) return (false, "لا يمكنك حجز معدتك الخاصة", null);

            if (await _equipmentRepository.HasOverlappingBookingAsync(equipmentId, start, end))
                return (false, "محجوزة بالفعل فى هذه الفترة", null);

            var days = (int)Math.Ceiling((end - start).TotalDays);
            var total = days * equipment.PricePerDay;

            var booking = new Booking
            {
                EquipmentId = equipmentId,
                RenterId = renterId,
                StartDate = start,
                EndDate = end,
                TotalPrice = total,
                Status = BookingStatus.Pending
            };

            await _bookingRepository.AddAsync(booking);
            await _context.SaveChangesAsync();

            return (true, null, booking);
        }

        public async Task<List<BookingDto>> GetMyBookingsAsync(string renterId)
        {
            var bookings = await _bookingRepository.GetByRenterAsync(renterId);
            return bookings.Select(MapToDto).ToList();
        }

        public async Task<List<BookingDto>> GetIncomingBookingsAsync(string ownerId)
        {
            var bookings = await _bookingRepository.GetIncomingForOwnerAsync(ownerId);
            return bookings.Select(MapToDto).ToList();
        }

        public async Task<BookingDto?> GetBookingByIdAsync(int id, string userId)
        {
            var b = await _bookingRepository.GetByIdWithDetailsAsync(id);
            if (b is null) return null;
            if (b.RenterId != userId && b.Equipment?.OwnerId != userId) return null;
            return MapToDto(b);
        }

        public async Task<(bool success, string? error)> ConfirmBookingAsync(int id, string ownerId)
        {
            var b = await _bookingRepository.GetByIdWithDetailsAsync(id);
            if (b is null) return (false, "الحجز غير موجود");
            if (b.Equipment?.OwnerId != ownerId) return (false, "غير مصرح");
            if (b.Status != BookingStatus.Pending) return (false, "لا يمكن تأكيد هذا الحجز");

            if (await _equipmentRepository.HasOverlappingBookingAsync(b.EquipmentId, b.StartDate, b.EndDate, b.Id))
                return (false, "يوجد تعارض مع حجز آخر");

            b.Status = BookingStatus.Confirmed;
            b.ConfirmedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool success, string? error)> RejectBookingAsync(int id, string ownerId, string? reason)
        {
            var b = await _bookingRepository.GetByIdWithDetailsAsync(id);
            if (b is null) return (false, "الحجز غير موجود");
            if (b.Equipment?.OwnerId != ownerId) return (false, "غير مصرح");
            if (b.Status != BookingStatus.Pending) return (false, "لا يمكن رفض هذا الحجز");

            b.Status = BookingStatus.Rejected;
            b.RejectionReason = reason;
            b.CancelledAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool success, string? error)> CancelBookingAsync(int id, string renterId)
        {
            var b = await _bookingRepository.GetByIdWithDetailsAsync(id);
            if (b is null) return (false, "الحجز غير موجود");
            if (b.RenterId != renterId) return (false, "غير مصرح");
            if (b.Status == BookingStatus.Completed || b.Status == BookingStatus.Cancelled)
                return (false, "لا يمكن إلغاء هذا الحجز");

            b.Status = BookingStatus.Cancelled;
            b.CancelledAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool success, string? error)> DeleteBookingAsync(int id, string userId)
        {
            var b = await _bookingRepository.GetByIdWithDetailsAsync(id);
            if (b is null) return (false, "الحجز غير موجود");
            if (b.RenterId != userId && b.Equipment?.OwnerId != userId) return (false, "غير مصرح");
            if (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed)
                return (false, "لا يمكن حذف حجز نشط. قم بإلغائه أولاً");

            _bookingRepository.Remove(b);
            await _context.SaveChangesAsync();
            return (true, null);
        }

        private static BookingDto MapToDto(Booking b) => new()
        {
            Id = b.Id,
            StartDate = b.StartDate,
            EndDate = b.EndDate,
            Days = b.Days,
            TotalPrice = b.TotalPrice,
            Status = b.Status.ToString(),

            EquipmentId = b.EquipmentId,
            EquipmentName = b.Equipment?.Name ?? string.Empty,
            EquipmentCategory = b.Equipment?.Category ?? string.Empty,
            EquipmentImageUrl = b.Equipment?.ImageUrl,

            RenterId = b.RenterId,
            RenterName = b.Renter?.FullName ?? string.Empty,

            OwnerId = b.Equipment?.OwnerId ?? string.Empty,
            OwnerName = b.Equipment?.Owner?.FullName ?? string.Empty,

            CreatedAt = b.CreatedAt,
            ConfirmedAt = b.ConfirmedAt,
            CancelledAt = b.CancelledAt,
            RejectionReason = b.RejectionReason
        };
    }
}