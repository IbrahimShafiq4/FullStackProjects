using EventSphere.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Infrastructure.Services
{
    public interface ISeatLockingService
    {
        Task<(bool success, string? error)> LockSeatAsync(int seatId, string userId);
        Task ReleaseExpiredLocksAsync();
    }
    public class SeatLockingService: ISeatLockingService
    {
        private readonly IAppDbContext          _context;
        private const int LockDurationMinutes = 2;

        public SeatLockingService(IAppDbContext context)
        { _context = context; }

        public async Task<(bool success, string? error)> LockSeatAsync(int seatId, string userId)
        {
            var seat = await _context.Seats.FindAsync(seatId);
            if (seat is null) return (false, "المقعد غير موجود.");

            if (seat.Status == Domain.Enums.SeatStatus.Locked && seat.LockedUntil < DateTime.UtcNow)
            {
                seat.Status = Domain.Enums.SeatStatus.Available;
                seat.LockedUntil = null;
            }

            if (seat.Status != Domain.Enums.SeatStatus.Available)
                return (false, "هذا المقعد غير متاح حاليا.");

            seat.Status = Domain.Enums.SeatStatus.Locked;
            seat.LockedUntil = DateTime.UtcNow.AddMinutes(LockDurationMinutes);

            await _context.SaveChangesAsync();
            return (true, null);
        }

        public async Task ReleaseExpiredLocksAsync()
        {
            var expiredSeates = await _context.Seats
                                    .Where(s => s.Status == Domain.Enums.SeatStatus.Locked && s.LockedUntil < DateTime.UtcNow)
                                    .ToListAsync();

            foreach(var seat in expiredSeates)
            {
                seat.Status = Domain.Enums.SeatStatus.Available;
                seat.LockedUntil = null;
            }

            if (expiredSeates.Any())
                await _context.SaveChangesAsync();
        }
    }
}
