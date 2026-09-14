using EventSphere.Application.Interfaces;
using EventSphere.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Application.Features.Events.Commands
{
    public record CreateEventCommand(string Title, DateTime EventDate, decimal BasePrice, int VenueId, string OrganizerId): IRequest<int>;

    public class CreateEventHandler: IRequestHandler<CreateEventCommand, int>
    {
        private readonly IAppDbContext _context;
        public CreateEventHandler(IAppDbContext context) { _context = context; }

        public async Task<int> Handle(CreateEventCommand request, CancellationToken cancellationToken)
        {
            var venue = await _context.Venues.FindAsync(new object[] { request.VenueId }, cancellationToken)
                ?? throw new InvalidOperationException("المكان غير موجود.");

            var @event = new Event
            {
                Title = request.Title,
                EventDate = request.EventDate,
                BasePrice = request.BasePrice,
                VenueId = request.VenueId,
                OrganizerId = request.OrganizerId
            };
            _context.Events.Add(@event);
            await _context.SaveChangesAsync(cancellationToken);

            for (int row = 1; row <= venue.TotalRows; row++)
            {
                for (int num = 1; num <= venue.SeatsPerRow; num++)
                {
                    _context.Seats.Add(new Seat { EventId = @event.Id, Row = row, Number = num });
                }
            }
            await _context.SaveChangesAsync(cancellationToken);

            return @event.Id;
        }
    }
}
