using EventSphere.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Application.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<Venue>    Venues      { get; }
        DbSet<Event>    Events      { get; }
        DbSet<Seat>     Seats       { get; }
        DbSet<Booking>  Bookings    { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
