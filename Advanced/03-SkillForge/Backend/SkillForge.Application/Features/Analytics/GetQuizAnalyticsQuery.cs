using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Interfaces;
using SkillForge.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Analytics
{
    public record QuestionDifficultyDto(string QuestionText, double CorrectRate);
    public record QuizAnalyticsDto(int TotalAttempts, double AverageScore, double StandardDeviation, List<QuestionDifficultyDto> QuestionDifficulty   );
    public record GetQuizAnalyticsQuery(int QuizId) : IRequest<QuizAnalyticsDto>;

    public class GetQuizAnalyticsHandler : IRequestHandler<GetQuizAnalyticsQuery, QuizAnalyticsDto>
    {
        private readonly IAppDbContext      _context;
        private readonly IStatisticsService _statisticsService;

        public GetQuizAnalyticsHandler(IAppDbContext context, IStatisticsService statisticsService)
        { _context = context; _statisticsService = statisticsService; }

        public async Task<QuizAnalyticsDto> Handle(GetQuizAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var attempts = await _context.QuizAttempts
                .Where(a => a.QuizId == request.QuizId && a.Status != AttemptStatus.InProgress)
                .ToListAsync(cancellationToken);

            var scores = attempts.Select(a => a.Score).ToList();
            var (average, stdDev, _) = _statisticsService.AnalyzeScore(scores.Count > 0 ? scores[0] : 0, scores);

            var questions = await _context.Questions.Where(q => q.QuizId == request.QuizId).ToListAsync(cancellationToken);
            var allAnswers = await _context.CandidateAnswers
                .Where(a => questions.Select(q => q.Id).Contains(a.QuestionId))
                .ToListAsync(cancellationToken);

            var difficulty = questions.Select(q =>
            {
                var questionAnswers = allAnswers.Where(a => a.QuestionId == q.Id).ToList();
                if (questionAnswers.Count == 0) return new QuestionDifficultyDto(q.Text, 0);

                var correctOptionIds = q.Options.Where(o => o.IsCorrect).Select(o => o.Id).ToHashSet();
                var correctCount = questionAnswers.Count(a => a.SelectedOptionIds.ToHashSet().SetEquals(correctOptionIds));

                return new QuestionDifficultyDto(q.Text, (double)correctCount / questionAnswers.Count * 100);
            }).ToList();

            return new QuizAnalyticsDto(attempts.Count, average, stdDev, difficulty);
        }
    }
}
