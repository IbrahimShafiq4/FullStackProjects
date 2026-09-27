using System;
using System.Collections.Generic;
using System.Text;

namespace MedConnect.Infrastructure.Services.BookingHandlers
{
    public class BookingRequest
    {
        public string   DoctorId    { get; set; } = string.Empty;
        public int      PatientId   { get; set; }
        public DateTime ScheduledAt { get; set; }
    }

    public class BookingResult
    {
        public bool     Success         { get; set; }
        public string?  ErrorMessage    { get; set; }
    }

    public abstract class BookingHandlerBase
    {
        protected BookingHandlerBase? Next;
        public BookingHandlerBase SetNext(BookingHandlerBase next)
        {
            Next = next;
            return next;
        }

        public abstract Task<BookingResult> HandleAsync(BookingRequest request);

        protected async Task<BookingResult> PassToNextAsync(BookingRequest request)
        {
            if (Next == null) return new BookingResult { Success = true };
            return await Next.HandleAsync(request);
        }
    }
}
