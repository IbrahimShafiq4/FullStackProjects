using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SignalDesk.BLL.DTOs.Profile;
using SignalDesk.DAL.Data;
using SignalDesk.DAL.Models;
using SignalDesk.DAL.Models.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SignalDesk.BLL.Services
{
    public interface IProfileService
    {
        Task<ProfileDto?> GetAsync(string userId, string role);
        Task<ProfileDto?> UpdateAsync(string userId, string role, UpdateProfileDto dto);
        Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto dto);
    }

    public class ProfileService : IProfileService
    {
        private readonly UserManager<AppUser> _users;
        private readonly AppDbContext _context;

        public ProfileService(UserManager<AppUser> users, AppDbContext context)
        {
            _users = users;
            _context = context;
        }

        public async Task<ProfileDto?> GetAsync(string userId, string role)
        {
            var user = await _users.FindByIdAsync(userId);
            if (user == null) return null;

            var created = await _context.Tickets.CountAsync(t => t.CustomerId == userId);
            var assigned = await _context.Tickets.CountAsync(t => t.AssignedAgentId == userId);
            var resolved = await _context.Tickets.CountAsync(t => t.AssignedAgentId == userId && (t.Status == TicketStatus.Resolved || t.Status == TicketStatus.Closed));

            return new ProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? "",
                Role = role,
                TicketsCreated = created,
                TicketsAssigned = assigned,
                TicketsResolved = resolved,
                JoinedAt = DateTime.UtcNow
            };
        }

        public async Task<ProfileDto?> UpdateAsync(string userId, string role, UpdateProfileDto dto)
        {
            var user = await _users.FindByIdAsync(userId);
            if (user == null) return null;

            user.FullName = dto.FullName;
            await _users.UpdateAsync(user);
            return await GetAsync(userId, role);
        }

        public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto dto)
        {
            var user = await _users.FindByIdAsync(userId);
            if (user == null) return false;

            var result = await _users.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
            return result.Succeeded;
        }
    }
}
