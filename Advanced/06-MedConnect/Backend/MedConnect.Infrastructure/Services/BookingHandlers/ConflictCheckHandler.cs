using MedConnect.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace MedConnect.Infrastructure.Services.BookingHandlers
{
    public class ConflictCheckHandler: BookingHandlerBase
    {
        private readonly IAppDbContext _context;
        public ConflictCheckHandler(IAppDbContext context)
        { _context = context; }

        public override async Task<BookingResult> HandleAsync(BookingRequest request)
        {
            var hasConflict = await _context.Appointments.AnyAsync(a =>
                a.DoctorId == request.DoctorId && a.ScheduledAt == request.ScheduledAt &&
                a.Status != Domain.Enums.AppointmentStatus.Cancelled);

            if (hasConflict)
                return new BookingResult { Success = false, ErrorMessage = "هذا الموعد محجوز بالفعل" };

            return await PassToNextAsync(request);
        }
    }
}
