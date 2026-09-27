using MediatR;
using EventSphere.Application.Interfaces;
using EventSphere.Domain.Entities;
using EventSphere.Domain.Enums;

namespace EventSphere.Application.Features.Bookings.Commands
{
    public record ConfirmBookingCommand(int SeatId, string AttendeeId) : IRequest<(bool success, string? error, int? bookingId)>;

    public class ConfirmBookingHandler : IRequestHandler<ConfirmBookingCommand, (bool, string?, int?)>
    {
        private readonly IAppDbContext _context;
        private readonly IPriceCalculator _priceCalculator;

        public ConfirmBookingHandler(IAppDbContext context, IPriceCalculator priceCalculator)
        {
            _context = context;
            _priceCalculator = priceCalculator;
        }

        public async Task<(bool, string?, int?)> Handle(ConfirmBookingCommand request, CancellationToken cancellationToken)
        {
            var seat = await _context.Seats.FindAsync(new object[] { request.SeatId }, cancellationToken);
            if (seat == null) return (false, "المقعد غير موجود.", null);
            if (seat.Status != SeatStatus.Locked) return (false, "يجب حجز المقعد مؤقتا أولا قبل التأكيد.", null);

            var @event = await _context.Events.FindAsync(new object[] { seat.EventId }, cancellationToken)!;
            var finalPrice = _priceCalculator.CalculateFinalPrice(@event!.BasePrice, @event.EventDate);

            seat.Status = SeatStatus.Booked;
            var booking = new Booking { SeatId = seat.Id, AttendeeId = request.AttendeeId, FinalPrice = finalPrice, Status = BookingStatus.Confirmed };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync(cancellationToken);

            return (true, null, booking.Id);
        }
    }
}