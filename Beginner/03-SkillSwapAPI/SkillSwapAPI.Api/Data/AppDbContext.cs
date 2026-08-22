using Microsoft.EntityFrameworkCore;

namespace SkillSwapAPI.Api.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {  }

        public DbSet<AppUser>   AppUsers    { get; set; }
        public DbSet<Skill>     Skills      { get; set; }
        public DbSet<UserSkill> UserSkills  { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserSkill>()
                        .HasOne(us => us.AppUser)
                        .WithMany(u => u.UserSkills)
                        .HasForeignKey(us => us.AppUserId);

            modelBuilder.Entity<UserSkill>()
                        .HasOne(us => us.Skill)
                        .WithMany(u => u.UserSkills)
                        .HasForeignKey(us => us.SkillId);

            modelBuilder.Entity<UserSkill>()
                .HasIndex(us => new { us.SkillId, us.AppUserId })
                .IsUnique();
        }
    }
}
