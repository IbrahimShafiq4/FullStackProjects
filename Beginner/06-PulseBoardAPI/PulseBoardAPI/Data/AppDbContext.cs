using Microsoft.EntityFrameworkCore;
using PulseBoardAPI.Models;

namespace PulseBoardAPI.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {  }

        public DbSet<PulseEntry> PulseEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<PulseEntry>()
                        .HasIndex(e => new { e.AppUserId, e.EntryDate })
                        .IsUnique();
        }
    }
}
