using MedConnect.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MedConnect.Infrastructure.Services.BookingHandlers
{
    public class PastDateCheckHandler: BookingHandlerBase
    {

        public override async Task<BookingResult> HandleAsync(BookingRequest request)
        {
            if (request.ScheduledAt < DateTime.UtcNow)
                return new BookingResult { Success = false, ErrorMessage = "لا يمكن حجز موعد فى الماضى" };

            return await PassToNextAsync(request);
        }
    }
}
