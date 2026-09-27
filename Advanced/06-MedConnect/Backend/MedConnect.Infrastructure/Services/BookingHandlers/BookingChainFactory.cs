using MedConnect.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MedConnect.Infrastructure.Services.BookingHandlers
{
    public interface IBookingChainFactory { BookingHandlerBase BuildChain(); }

    public class BookingChainFactory: IBookingChainFactory
    {
        private readonly IAppDbContext _context;
        public BookingChainFactory(IAppDbContext context)
        { _context = context; }

        public BookingHandlerBase BuildChain()
        {
            var pastDateCheck = new PastDateCheckHandler();
            var availabilityCheck = new AvailabilityCheckHandler(_context);
            var conflictCheck = new ConflictCheckHandler(_context);

            pastDateCheck.SetNext(availabilityCheck).SetNext(conflictCheck);

            return pastDateCheck;
        }
    }
}
