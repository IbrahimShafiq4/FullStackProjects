using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TalentBridgeAPI.Models;

namespace TalentBridgeAPI.Data
{
    public class AppDbContext: IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {  }

        public DbSet<Job>                   Jobs                    { get; set; }
        public DbSet<JobSkillRequirement>   JobSkillRequirements    { get; set; }
        public DbSet<CandidateProfile>      CandidateProfiles       { get; set; }
        public DbSet<CandidateSkill>        CandidateSkills         { get; set; }
        public DbSet<Application>           Applications            { get; set; }
        public DbSet<Notification>          Notifications           { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Job>()
                .HasOne(j => j.Employer)
                .WithMany()
                .HasForeignKey(j => j.EmployerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Application>()
                .HasIndex(a => new { a.JobId, a.CandidateId })
                .IsUnique();
        }

    }
}
