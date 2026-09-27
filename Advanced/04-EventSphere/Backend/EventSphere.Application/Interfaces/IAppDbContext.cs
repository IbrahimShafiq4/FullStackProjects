using EventSphere.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventSphere.Application.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<Venue>        Venues          { get; }
        DbSet<Event>        Events          { get; }
        DbSet<Seat>         Seats           { get; }
        DbSet<Booking>      Bookings        { get; }
        DbSet<Testimonial>  Testimonials    { get; }
        DbSet<AppUser>      Users           { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}