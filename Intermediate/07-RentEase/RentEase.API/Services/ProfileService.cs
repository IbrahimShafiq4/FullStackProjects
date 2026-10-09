using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RentEase.API.Data;
using RentEase.API.DTOs;
using RentEase.API.Models;

namespace RentEase.API.Services
{
    public interface IProfileService
    {
        Task<ProfileDto?> GetAsync(string userId);
        Task<(bool success, string? error)> UpdateAsync(string userId, UpdateProfileDto dto);
        Task<(bool success, IEnumerable<string>? errors)> ChangePasswordAsync(string userId, ChangePasswordDto dto);
    }

    public class ProfileService : IProfileService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly AppDbContext _context;

        public ProfileService(UserManager<AppUser> userManager, AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public async Task<ProfileDto?> GetAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user is null) return null;

            var equipmentCount = await _context.Equipments.CountAsync(e => e.OwnerId == userId);
            var activeRentals = await _context.Bookings.CountAsync(b =>
                b.RenterId == userId && (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed));
            var completedRentals = await _context.Bookings.CountAsync(b =>
                b.RenterId == userId && b.Status == BookingStatus.Completed);

            return new ProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber,
                EquipmentCount = equipmentCount,
                ActiveRentalsCount = activeRentals,
                CompletedRentalsCount = completedRentals
            };
        }

        public async Task<(bool success, string? error)> UpdateAsync(string userId, UpdateProfileDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
                return (false, "الاسم مطلوب");

            var user = await _userManager.FindByIdAsync(userId);
            if (user is null) return (false, "المستخدم غير موجود");

            user.FullName = dto.FullName.Trim();
            user.PhoneNumber = dto.PhoneNumber?.Trim();

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded ? (true, null) : (false, "فشل تحديث البيانات");
        }

        public async Task<(bool success, IEnumerable<string>? errors)> ChangePasswordAsync(string userId, ChangePasswordDto dto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user is null) return (false, new[] { "المستخدم غير موجود" });

            var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
            return result.Succeeded
                ? (true, null)
                : (false, result.Errors.Select(e => e.Description));
        }
    }
}