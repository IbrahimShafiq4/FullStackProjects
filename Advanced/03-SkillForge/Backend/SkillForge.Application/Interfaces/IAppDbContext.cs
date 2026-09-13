using SkillForge.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace SkillForge.Application.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<Company> Companies { get; }
        DbSet<Quiz> Quizzes { get; }
        DbSet<Question> Questions { get; }
        DbSet<AnswerOption> AnswerOptions { get; }
        DbSet<Candidate> Candidates { get; }
        DbSet<QuizAttempt> QuizAttempts { get; }
        DbSet<CandidateAnswer> CandidateAnswers { get; }
        DbSet<Testimonial> Testimonials { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
