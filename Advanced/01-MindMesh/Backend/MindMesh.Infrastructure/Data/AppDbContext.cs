using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MindMesh.Application.Interfaces;
using MindMesh.Domain.Entities;

namespace MindMesh.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Board> Boards { get; set; } = null!;
        public DbSet<Card> Cards { get; set; } = null!;
        public DbSet<CardConnection> Connections { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Board>()
                .HasOne(b => b.Owner)
                .WithMany(u => u.Boards)
                .HasForeignKey(b => b.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CardConnection>()
                .HasOne(c => c.FromCard)
                .WithMany()
                .HasForeignKey(c => c.FromCardId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<CardConnection>()
                .HasOne(c => c.ToCard)
                .WithMany()
                .HasForeignKey(c => c.ToCardId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}