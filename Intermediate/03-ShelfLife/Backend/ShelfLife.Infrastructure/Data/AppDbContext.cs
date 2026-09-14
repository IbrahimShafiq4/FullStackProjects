using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ShelfLife.Domain.Entities;

namespace ShelfLife.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        private static readonly DateTime SeedDate =
            new(2026, 9, 14, 0, 0, 0, DateTimeKind.Utc);

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<RecipeVideo> RecipeVideos { get; set; }
        public DbSet<ShoppingItem> ShoppingItems { get; set; }
        public DbSet<ActivityItem> ActivityItems { get; set; }
        public DbSet<Challenge> Challenges { get; set; }
        public DbSet<Testimonial> Testimonials { get; set; }
        public DbSet<ChallengeParticipation> ChallengeParticipations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ShoppingItem>(e =>
            {
                e.HasOne(s => s.AppUser)
                    .WithMany()
                    .HasForeignKey(s => s.AppUserId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.Property(s => s.Name)
                    .HasMaxLength(200)
                    .IsRequired();
            });

            modelBuilder.Entity<ActivityItem>(e =>
            {
                e.Property(a => a.UserName)
                    .HasMaxLength(100)
                    .IsRequired();

                e.Property(a => a.UserInitial)
                    .HasMaxLength(2)
                    .IsRequired();

                e.Property(a => a.Action)
                    .HasMaxLength(300)
                    .IsRequired();

                e.Property(a => a.City)
                    .HasMaxLength(80)
                    .IsRequired();

                e.HasIndex(a => a.CreatedAt)
                    .IsDescending();
            });

            modelBuilder.Entity<Challenge>(e =>
            {
                e.Property(c => c.Title)
                    .HasMaxLength(150)
                    .IsRequired();

                e.Property(c => c.Description)
                    .HasMaxLength(500)
                    .IsRequired();

                e.Property(c => c.Reward)
                    .HasMaxLength(150)
                    .IsRequired();
            });

            modelBuilder.Entity<Testimonial>(e =>
            {
                e.Property(t => t.Name).HasMaxLength(100).IsRequired();
                e.Property(t => t.Role).HasMaxLength(100).IsRequired();
                e.Property(t => t.City).HasMaxLength(80).IsRequired();
                e.Property(t => t.Quote).HasMaxLength(500).IsRequired();
                e.Property(t => t.Initials).HasMaxLength(3).IsRequired();
                e.HasIndex(t => t.IsApproved);

                e.HasOne(t => t.AppUser)
                    .WithMany()
                    .HasForeignKey(t => t.AppUserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ChallengeParticipation>(e =>
            {
                e.HasOne(p => p.Challenge)
                    .WithMany()
                    .HasForeignKey(p => p.ChallengeId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(p => p.AppUser)
                    .WithMany()
                    .HasForeignKey(p => p.AppUserId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.Property(p => p.PhotoUrl).HasMaxLength(500).IsRequired();
                e.Property(p => p.Caption).HasMaxLength(300);

                e.HasIndex(p => new { p.ChallengeId, p.AppUserId }).IsUnique();
                e.HasIndex(p => p.Rank);
            });

            SeedActivities(modelBuilder);
            SeedTestimonials(modelBuilder);
            SeedChallenges(modelBuilder);
        }

        private static void SeedActivities(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ActivityItem>().HasData(
                new ActivityItem
                {
                    Id = 1,
                    UserName = "أحمد مصطفى",
                    UserInitial = "أ",
                    Action = "أضاف 5 منتجات للمخزون",
                    City = "القاهرة",
                    CreatedAt = SeedDate.AddMinutes(-2)
                },
                new ActivityItem
                {
                    Id = 2,
                    UserName = "منة شريف",
                    UserInitial = "م",
                    Action = "وفّرت 120 ج.م هذا الأسبوع",
                    City = "القاهرة",
                    CreatedAt = SeedDate.AddMinutes(-5)
                },
                new ActivityItem
                {
                    Id = 3,
                    UserName = "يوسف سامي",
                    UserInitial = "ي",
                    Action = "سجّل ملاحظة صوتية على اللبن",
                    City = "القاهرة",
                    CreatedAt = SeedDate.AddMinutes(-8)
                },
                new ActivityItem
                {
                    Id = 4,
                    UserName = "نور ياسر",
                    UserInitial = "ن",
                    Action = "أكملت تحدي الأسبوع",
                    City = "القاهرة",
                    CreatedAt = SeedDate.AddMinutes(-12)
                },
                new ActivityItem
                {
                    Id = 5,
                    UserName = "كريم فؤاد",
                    UserInitial = "ك",
                    Action = "أنشأ فيديو وصفة جديدة",
                    City = "القاهرة",
                    CreatedAt = SeedDate.AddMinutes(-18)
                },
                new ActivityItem
                {
                    Id = 6,
                    UserName = "هبة محمود",
                    UserInitial = "هـ",
                    Action = "قلّلت الهدر بنسبة 40%",
                    City = "القاهرة",
                    CreatedAt = SeedDate.AddMinutes(-25)
                }
            );
        }

        private static void SeedTestimonials(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Testimonial>().HasData(
                new Testimonial
                {
                    Id = 1,
                    Name = "رؤى ياسر",
                    Role = "ربة منزل",
                    City = "القاهرة",
                    Initials = "ر",
                    Rating = 5,
                    IsApproved = true,
                    Quote = "قبل كده كنت بنسى الأكل في التلاجة وأكتشفه بعد ما يبوظ. دلوقتي كل حاجة واضحة قدامي، وأوفر فلوس كتير على المشتريات.",
                    CreatedAt = SeedDate.AddDays(-30)
                },
                new Testimonial
                {
                    Id = 2,
                    Name = "أحمد شفيق",
                    Role = "digital Marketing",
                    City = "القاهرة",
                    Initials = "أ",
                    Rating = 5,
                    IsApproved = true,
                    Quote = "الملاحظات الصوتية عبقرية. بسجّل \"ده للعشا\" وأنا في المطبخ وإيدي مليانة. حاجة بسيطة بس بتفرق كتير.",
                    CreatedAt = SeedDate.AddDays(-20)
                },
                new Testimonial
                {
                    Id = 3,
                    Name = "إبراهيم شفيق",
                    Role = "Software engineer",
                    City = "القاهرة",
                    Initials = "إ",
                    Rating = 5,
                    IsApproved = true,
                    Quote = "بقت أطبخ من اللي عندي بدل ما أطلب دليفري كل يوم. وفّرت مصروف كبير، ومبسوط إني بقيت أهتم بأكل بيتي.",
                    CreatedAt = SeedDate.AddDays(-15)
                }
            );
        }

        private static void SeedChallenges(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Challenge>().HasData(
                new Challenge
                {
                    Id = 1,
                    Title = "تحدي الأسبوع",
                    Description = "استخدم 5 منتجات من مخزونك قبل ما تخلص. لو كملت التحدي، هتكسب شارة \"مطبخ ذكي\" — وبتوفر فلوس في نفس الوقت.",
                    Reward = "🏅 SMART KITCHEN BADGE",
                    Days = 5,
                    Target = 5,
                    IsActive = true,
                    CreatedAt = SeedDate.AddDays(-7)
                }
            );
        }
    }
}