namespace EventSphere.Application.Features.Landing
{
    public record LandingStatsDto(
        int TotalEvents,
        int TotalVenues,
        int TotalBookings,
        int TotalAttendees,
        decimal TotalRevenue,
        int UpcomingEvents
    );

    public record FeaturedEventDto(
        int Id,
        string Title,
        DateTime EventDate,
        decimal BasePrice,
        string VenueName,
        string VenueAddress,
        int TotalSeats,
        int BookedSeats,
        int AvailableSeats,
        string OrganizerName
    );

    public record VenueCardDto(
        int Id,
        string Name,
        string Address,
        int TotalRows,
        int SeatsPerRow,
        int TotalCapacity,
        int TotalEvents
    );

    public record CategoryDto(
        string Key,
        string Name,
        string Hieroglyph,
        string Description,
        int EventCount
    );

    public record ActivityDto(
        string UserName,
        string UserInitial,
        string Action,
        string City,
        string TimeAgo,
        string Hieroglyph
    );

    public record TestimonialDto(
        int Id,
        string Name,
        string Role,
        string City,
        string Message,
        string Hieroglyph,
        int Rating
    );

    public record PricingRuleDto(
        string Key,
        string Name,
        string Hieroglyph,
        string Description,
        string Effect
    );
}