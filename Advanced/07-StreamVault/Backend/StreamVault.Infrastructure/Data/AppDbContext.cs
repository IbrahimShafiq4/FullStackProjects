using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StreamVault.Application.Interfaces;
using StreamVault.Domain.Domain;
using StreamVault.Domain.Entities;

namespace StreamVault.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<Instructor>, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Course> Courses { get; set; } = null!;
        public DbSet<Video> Videos { get; set; } = null!;
        public DbSet<Subscription> Subscriptions { get; set; } = null!;
        public DbSet<WatchProgress> WatchProgresses { get; set; } = null!;
        public DbSet<LiveSession> LiveSessions { get; set; } = null!;
        public DbSet<RaisedHand> RaisedHands { get; set; } = null!;
        public DbSet<LiveChatMessage> LiveChatMessages { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<StudyFile> StudyFiles { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;
        public DbSet<Floor> Floors { get; set; } = null!;
        public DbSet<TeacherWallet> TeacherWallets { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Course>()
                   .HasOne(c => c.Instructor)
                   .WithMany()
                   .HasForeignKey(c => c.InstructorId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Course>()
                   .HasOne(c => c.Floor)
                   .WithMany(f => f.Classrooms)
                   .HasForeignKey(c => c.FloorId)
                   .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Payment>()
                   .HasOne(p => p.Student)
                   .WithMany()
                   .HasForeignKey(p => p.StudentId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Payment>()
                   .HasOne(p => p.Teacher)
                   .WithMany()
                   .HasForeignKey(p => p.TeacherId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Payment>()
                   .HasOne(p => p.Course)
                   .WithMany()
                   .HasForeignKey(p => p.CourseId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Payment>()
                   .HasOne(p => p.StudyFile)
                   .WithMany()
                   .HasForeignKey(p => p.StudyFileId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Payment>()
                   .Property(p => p.Amount)
                   .HasPrecision(18, 2);

            builder.Entity<StudyFile>()
                   .HasOne(s => s.Course)
                   .WithMany()
                   .HasForeignKey(s => s.CourseId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<StudyFile>()
                   .HasOne(s => s.Teacher)
                   .WithMany()
                   .HasForeignKey(s => s.TeacherId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<StudyFile>()
                   .Property(s => s.Price)
                   .HasPrecision(18, 2);

            builder.Entity<Review>()
                   .HasOne(r => r.Author)
                   .WithMany()
                   .HasForeignKey(r => r.AuthorId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Review>()
                   .HasIndex(r => new { r.TargetType, r.TargetId });

            builder.Entity<Payment>()
                   .HasIndex(p => new { p.StudentId, p.Status });

            builder.Entity<Payment>()
                   .HasIndex(p => new { p.TeacherId, p.Status });

            builder.Entity<Floor>()
                   .HasIndex(f => f.Number)
                   .IsUnique();

            builder.Entity<TeacherWallet>()
                   .HasOne(w => w.Teacher)
                   .WithMany()
                   .HasForeignKey(w => w.TeacherId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<TeacherWallet>()
                   .HasIndex(w => w.TeacherId);
        }
    }
}