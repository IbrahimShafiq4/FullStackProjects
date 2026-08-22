using Microsoft.EntityFrameworkCore;
using VideoPlatformApi.Api.Models;
using VideoPlatformApi.Models;

namespace VideoPlatformApi.Api.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {  }

        public DbSet<Video>     Videos      { get; set; }
        public DbSet<User>      Users       { get; set; }
        public DbSet<Like>      Likes       { get; set; }
        public DbSet<Comment>   Comments    { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                        .HasMany(u => u.Videos)
                        .WithOne(v => v.User)
                        .HasForeignKey(v => v.UserId)
                        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                        .HasMany(u => u.Likes)
                        .WithOne(l => l.User)
                        .HasForeignKey(l => l.UserId)
                        .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<User>()
                        .HasMany(u => u.Comments)
                        .WithOne(c => c.User)
                        .HasForeignKey(c => c.UserId)
                        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                        .HasMany(u => u.Comments)
                        .WithOne(c => c.User)
                        .HasForeignKey(c => c.UserId)
                        .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Video>()
                        .HasMany(v => v.Likes)
                        .WithOne(l => l.Video)
                        .HasForeignKey(l => l.VideoId)
                        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Like>()
                        .HasIndex(l => new { l.VideoId, l.UserId })
                        .IsUnique();

        }
    }
}
