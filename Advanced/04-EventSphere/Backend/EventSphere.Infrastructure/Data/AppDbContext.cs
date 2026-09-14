using EventSphere.Application.Interfaces;
using EventSphere.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Infrastructure.Data
{
    public class AppDbContext: IdentityDbContext<AppUser>, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options)
        {  }

        public DbSet<Venue>     Venues      { get; set; } = null!;
        public DbSet<Event>     Events      { get; set; } = null!;
        public DbSet<Seat>      Seats       { get; set; } = null!;
        public DbSet<Booking>   Bookings    { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Event>().Property(e => e.BasePrice).HasPrecision(10, 2);
            builder.Entity<Booking>().Property(b => b.FinalPrice).HasPrecision(10, 2);

            builder.Entity<Booking>()
                    .HasIndex(b => b.SeatId)
                    .HasFilter("[Status] != 3");
        }
    }
}
