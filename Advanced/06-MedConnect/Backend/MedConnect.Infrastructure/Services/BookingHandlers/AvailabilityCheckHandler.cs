using MedConnect.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace MedConnect.Infrastructure.Services.BookingHandlers
{
    public class AvailabilityCheckHandler: BookingHandlerBase
    {
        private readonly IAppDbContext _context;
        public AvailabilityCheckHandler(IAppDbContext context)
        { _context = context; }

        public override async Task<BookingResult> HandleAsync(BookingRequest request)
        {
            var requestDay      = request.ScheduledAt.DayOfWeek;
            var requestedTime   = request.ScheduledAt.TimeOfDay;

            var hasSlot = await _context.AvailabilitySlots.AnyAsync(s =>
                s.DoctorId == request.DoctorId && s.DayOfWeek == requestDay &&
                s.StartTime <= requestedTime && s.EndTime >= requestedTime);

            if (!hasSlot)
                return new BookingResult { Success = false, ErrorMessage = "الدكتور غير متاح فى هذا الوقت" };

            return await PassToNextAsync(request);
        }
    }
}
