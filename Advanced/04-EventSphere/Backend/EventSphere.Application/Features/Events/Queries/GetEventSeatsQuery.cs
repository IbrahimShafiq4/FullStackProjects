using EventSphere.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Application.Features.Events.Queries
{
    public record GetEventSeatsQuery(int EventId) : IRequest<List<SeatDto>>;

    public class GetEventSeatsHandler: IRequestHandler<GetEventSeatsQuery, List<SeatDto>>
    {
        private readonly IAppDbContext      _context;
        private readonly IPriceCalculator   _priceCalculator;
        public GetEventSeatsHandler(IAppDbContext context, IPriceCalculator priceCalculator)
        { _context = context; _priceCalculator = priceCalculator; }

        public async Task<List<SeatDto>> Handle(GetEventSeatsQuery req, CancellationToken cancellationToken)
        {
            var @event = await _context.Events.FindAsync(new object[] { req.EventId }, cancellationToken);
            if (@event is null) return new List<SeatDto>();

            var finalPrice = _priceCalculator.CalculateFinalPrice(@event.BasePrice, @event.EventDate);

            return await _context.Seats
                .Where(s => s.EventId == req.EventId)
                .Select(s => new SeatDto(s.Id, s.Row, s.Number, s.Status.ToString(), finalPrice))
                .ToListAsync(cancellationToken);
        }
    }
}
