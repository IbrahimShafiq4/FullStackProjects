using RentEase.API.Data;
using RentEase.API.DTOs;
using RentEase.API.Generics;
using RentEase.API.Models;

namespace RentEase.API.Services
{
    public interface IEquipmentService
    {
        Task<(bool success, string? error)> UpdateAsync(int id, string ownerId, UpdateEquipmentDto dto);
        Task<(bool success, string? error)> SetAvailabilityAsync(int id, string ownerId, bool isAvailable);
    }

    public class EquipmentService : IEquipmentService
    {
        private readonly IEquipmentRepository _repo;
        private readonly IBookingRepository _bookingRepo;
        private readonly AppDbContext _context;

        public EquipmentService(IEquipmentRepository repo, IBookingRepository bookingRepo, AppDbContext context)
        {
            _repo = repo;
            _bookingRepo = bookingRepo;
            _context = context;
        }

        public async Task<(bool success, string? error)> UpdateAsync(int id, string ownerId, UpdateEquipmentDto dto)
        {
            var equipment = await _repo.GetByIdAsync(id);
            if (equipment is null) return (false, "المعدة غير موجودة");
            if (equipment.OwnerId != ownerId) return (false, "غير مصرح");

            if (string.IsNullOrWhiteSpace(dto.Name)) return (false, "الاسم مطلوب");
            if (string.IsNullOrWhiteSpace(dto.Category)) return (false, "الفئة مطلوبة");
            if (dto.PricePerDay <= 0) return (false, "السعر يجب ان يكون اكبر من صفر");

            equipment.Name = dto.Name.Trim();
            equipment.Category = dto.Category.Trim();
            equipment.PricePerDay = dto.PricePerDay;
            equipment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool success, string? error)> SetAvailabilityAsync(int id, string ownerId, bool isAvailable)
        {
            var equipment = await _repo.GetByIdAsync(id);
            if (equipment is null) return (false, "المعدة غير موجودة");
            if (equipment.OwnerId != ownerId) return (false, "غير مصرح");

            if (!isAvailable && await _bookingRepo.EquipmentHasActiveBookingsAsync(id))
                return (false, "لا يمكن تعطيل معدّة لها حجوزات نشطة");

            equipment.IsAvailable = isAvailable;
            equipment.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return (true, null);
        }
    }
}