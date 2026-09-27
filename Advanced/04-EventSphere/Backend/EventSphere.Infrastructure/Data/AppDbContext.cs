using EventSphere.Application.Interfaces;
using EventSphere.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EventSphere.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        { }

        public DbSet<Venue> Venues { get; set; } = null!;
        public DbSet<Event> Events { get; set; } = null!;
        public DbSet<Seat> Seats { get; set; } = null!;
        public DbSet<Booking> Bookings { get; set; } = null!;
        public DbSet<Testimonial> Testimonials { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Event>()
                .Property(e => e.BasePrice)
                .HasPrecision(10, 2);

            builder.Entity<Booking>()
                .Property(b => b.FinalPrice)
                .HasPrecision(10, 2);

            builder.Entity<Booking>()
                .HasIndex(b => b.SeatId)
                .HasFilter("[Status] != 3");

            builder.Entity<Event>()
                .HasOne(e => e.Organizer)
                .WithMany()
                .HasForeignKey(e => e.OrganizerId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Booking>()
                .HasOne(b => b.Attendee)
                .WithMany()
                .HasForeignKey(b => b.AttendeeId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Booking>()
                .HasOne(b => b.Seat)
                .WithMany()
                .HasForeignKey(b => b.SeatId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Testimonial>(e =>
            {
                e.Property(t => t.Name).HasMaxLength(100).IsRequired();
                e.Property(t => t.Role).HasMaxLength(100).IsRequired();
                e.Property(t => t.City).HasMaxLength(80).IsRequired();
                e.Property(t => t.Message).HasMaxLength(500).IsRequired();
                e.Property(t => t.Hieroglyph).HasMaxLength(8);
                e.HasIndex(t => t.IsPublished);
            });

            SeedTestimonials(builder);
        }

        private static void SeedTestimonials(ModelBuilder builder)
        {
            var seedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            builder.Entity<Testimonial>().HasData(
                new Testimonial
                {
                    Id = 1,
                    Name = "إبراهيم شفيق",
                    Role = "منظّم فعاليات",
                    City = "القاهرة",
                    Hieroglyph = "𓂀",
                    Rating = 5,
                    IsPublished = true,
                    Message = "أفضل منصة لتنظيم الفعاليات الكبرى. الحجز بالمقاعد مريح جدًا والتحليلات بتساعدني أعرف نجاح كل فعالية.",
                    CreatedAt = seedDate
                },
                new Testimonial
                {
                    Id = 2,
                    Name = "رؤى ياسر",
                    Role = "حضور دائم",
                    City = "القاهرة",
                    Hieroglyph = "𓋹",
                    Rating = 5,
                    IsPublished = true,
                    Message = "اختيار المقعد بسهولة، الحجز المؤقت بيخليك مرتاح، والتأكيد فوري. تجربة ممتازة!",
                    CreatedAt = seedDate.AddDays(1)
                },
                new Testimonial
                {
                    Id = 3,
                    Name = "أحمد شفيق",
                    Role = "مدير معبد",
                    City = "القاهرة",
                    Hieroglyph = "𓅓",
                    Rating = 5,
                    IsPublished = true,
                    Message = "بنستخدمها لإدارة كل الفعاليات في المكان. لوحة التحليلات بتورينا نسبة الإشغال والإيرادات في الوقت الحقيقي.",
                    CreatedAt = seedDate.AddDays(2)
                }
            );
        }
    }
}