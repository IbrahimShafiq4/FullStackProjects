using FitTrackPro.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FitTrackPro.API.Data
{
    public class AppDbContext: IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {  }

        public DbSet<WorkoutPlan>       WorkoutPlans    { get; set; }
        public DbSet<Exercise>          Exercises       { get; set; }
        public DbSet<PlanEnrollment>    PlanEnrollments { get; set; }
        public DbSet<WorkoutLog>        WorkoutLogs     { get; set; }
        public DbSet<CoachRating>       CoachRatings    { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<WorkoutLog>()
                .Property(wl => wl.Weight).HasPrecision(6, 2);

            builder.Entity<PlanEnrollment>()
                .HasIndex(e => new { e.WorkoutPlanId, e.TraineeId })
                .IsUnique();

            builder.Entity<WorkoutPlan>()
                .HasOne(p => p.Coach)
                .WithMany()
                .HasForeignKey(p => p.CoachId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<CoachRating>()
                .HasIndex(cr => new { cr.TraineeId, cr.CoachId })
                .IsUnique();

            builder.Entity<CoachRating>()
                .HasOne(cr => cr.Trainee)
                .WithMany()
                .HasForeignKey(cr => cr.TraineeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<CoachRating>()
                .HasOne(cr => cr.Coach)
                .WithMany()
                .HasForeignKey(cr => cr.CoachId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
