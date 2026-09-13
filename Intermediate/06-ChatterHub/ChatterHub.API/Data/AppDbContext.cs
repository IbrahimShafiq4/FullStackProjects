using ChatterHub.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ChatterHub.API.Data
{
    public class AppDbContext: IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options) {  }

        public DbSet<Room>          Rooms           { get; set; }
        public DbSet<RoomMessage>   RoomMessages    { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<RoomMessage>()
                   .HasOne(rm => rm.Sender)
                   .WithMany()
                   .HasForeignKey(rm => rm.SenderId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
