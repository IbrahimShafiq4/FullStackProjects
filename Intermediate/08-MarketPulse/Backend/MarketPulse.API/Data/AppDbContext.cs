using MarketPulse.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MarketPulse.API.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Auction> Auctions { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Auction>().Property(a => a.StartingPrice).HasPrecision(10, 2);
            builder.Entity<Auction>().Property(a => a.CurrentHighestBid).HasPrecision(10, 2);
            builder.Entity<Bid>().Property(b => b.Amount).HasPrecision(10, 2);

            builder.Entity<Auction>()
                .HasOne(a => a.Seller).WithMany()
                .HasForeignKey(a => a.SellerId).OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Auction>()
                .HasOne(a => a.Winner).WithMany()
                .HasForeignKey(a => a.WinnerId).OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Bid>()
                .HasOne(b => b.Auction).WithMany(a => a.Bids)
                .HasForeignKey(b => b.AuctionId).OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Bid>()
                .HasOne(b => b.Bidder).WithMany()
                .HasForeignKey(b => b.BidderId).OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Auction>().HasIndex(a => new { a.Status, a.EndsAt });
            builder.Entity<Bid>().HasIndex(b => new { b.AuctionId, b.PlacedAt });
            builder.Entity<AuditLog>().HasIndex(a => a.OccurredAt);

            builder.Entity<Auction>()
                .Property(a => a.MediaUrls)
                .HasConversion(
                    v => string.Join(';', v),
                    v => string.IsNullOrEmpty(v)
                        ? new List<string>()
                        : v.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList());
        }
    }
}