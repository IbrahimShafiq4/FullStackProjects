using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Application.Features
{
    public record VenueDto(int Id, string Name, string Address, int TotalRows, int SeatsPerRow);
    public record EventDto(int Id, string Title, DateTime EventDate, decimal BasePrice, string VenueName);
    public record SeatDto(int Id, int Row, int Number, string Status, decimal? CalculatedPrice);
    public record CreateEventRequest(string Title, DateTime EventDate, decimal BasePrice, int VenueId);
    public record CreateVenueRequest(string Name, string Address, int TotalRows, int SeatsPerRow);
}
