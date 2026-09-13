using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Interfaces;
using SkillForge.Domain.Entities;
using System.Reflection.Emit;

public class AppDbContext : IdentityDbContext<AppUser>, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Company> Companies { get; set; } = null!;
    public DbSet<Quiz> Quizzes { get; set; } = null!;
    public DbSet<Question> Questions { get; set; } = null!;
    public DbSet<AnswerOption> AnswerOptions { get; set; } = null!;
    public DbSet<Candidate> Candidates { get; set; } = null!;
    public DbSet<QuizAttempt> QuizAttempts { get; set; } = null!;
    public DbSet<CandidateAnswer> CandidateAnswers { get; set; } = null!;
    public DbSet<Testimonial> Testimonials { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<CandidateAnswer>()
            .Property(a => a.SelectedOptionIds)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(
                        ',',
                        StringSplitOptions.RemoveEmptyEntries)
                    .Select(int.Parse)
                    .ToList()
            );

        builder.Entity<Company>()
            .HasIndex(c => c.OwnerId);

        builder.Entity<CandidateAnswer>()
            .HasOne(a => a.QuizAttempt)
            .WithMany(a => a.Answers)
            .HasForeignKey(a => a.QuizAttemptId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CandidateAnswer>()
            .HasOne(a => a.Question)
            .WithMany()
            .HasForeignKey(a => a.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Testimonial>(e =>
        {
            e.Property(t => t.AuthorName).HasMaxLength(100).IsRequired();
            e.Property(t => t.AuthorRole).HasMaxLength(100).IsRequired();
            e.Property(t => t.Message).HasMaxLength(600).IsRequired();
            e.Property(t => t.Rating).IsRequired();

            e.HasOne(t => t.Company)
                .WithMany()
                .HasForeignKey(t => t.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(t => t.IsPublished);
            e.HasIndex(t => t.CreatedAt);
        });
    }
}