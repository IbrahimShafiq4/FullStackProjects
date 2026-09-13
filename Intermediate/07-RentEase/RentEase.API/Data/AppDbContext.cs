using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RentEase.API.Models;

namespace RentEase.API.Data
{
    public class AppDbContext: IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {  }

        public DbSet<Equipment> Equipments  { get; set; }
        public DbSet<Booking>   Bookings    { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Equipment>()
                   .Property(e => e.PricePerDay)
                   .HasPrecision(10, 2);
        }
    }
}
