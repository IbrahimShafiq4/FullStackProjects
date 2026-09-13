using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Interfaces;
using SkillForge.Domain.Entities;
using SkillForge.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Attempts.Commands
{
    public record SubmitAttemptCommand(int AttemptId, List<(int QuestionId, List<int> SelectedOptionIds)> Answers) : IRequest<AttemptResultDto>;

    public class SubmitAttemptHandler: IRequestHandler<SubmitAttemptCommand, AttemptResultDto>
    {
        private readonly IAppDbContext              _context;
        private readonly IScoringStrategyFactory    _startegyFactory;
        private readonly IStatisticsService         _statisticsService;

        public SubmitAttemptHandler(
            IAppDbContext           context, 
            IScoringStrategyFactory strategyFactory, 
            IStatisticsService      statisticsService
        )
        {
            _context            = context;
            _startegyFactory    = strategyFactory;
            _statisticsService  = statisticsService;
        }

        public async Task<AttemptResultDto> Handle(SubmitAttemptCommand request, CancellationToken cancellationToken)
        {
            var attempt = await _context.QuizAttempts
                .Include(a => a.Quiz).ThenInclude(q => q.Questions).ThenInclude(qq => qq.Options)
                .FirstOrDefaultAsync(a => a.Id == request.AttemptId, cancellationToken)
                ?? throw new InvalidOperationException("المحاولة غير موجودة.");

            var deadline = attempt.StartedAt.AddMinutes(attempt.Quiz.DurationMinutes);
            var isTimedOut = DateTime.UtcNow > deadline;

            double totalPoints = 0;
            double earnedPoints = 0;

            foreach (var question in attempt.Quiz.Questions)
            {
                totalPoints += question.Points;

                var answer = request.Answers.FirstOrDefault(a => a.QuestionId == question.Id);
                if (answer.SelectedOptionIds == null) continue;

                var strategy = _startegyFactory.GetStrategy(question.Type);
                var questionScore = strategy.CalculateScore(question, answer.SelectedOptionIds);
                earnedPoints += questionScore * question.Points;

                _context.CandidateAnswers.Add(new CandidateAnswer
                {
                    QuizAttemptId = attempt.Id,
                    QuestionId = question.Id,
                    SelectedOptionIds = answer.SelectedOptionIds
                });
            }

            attempt.Score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
            attempt.SubmittedAt = DateTime.UtcNow;
            attempt.Status = isTimedOut ? AttemptStatus.TimeOut : AttemptStatus.Submitted;

            await _context.SaveChangesAsync(cancellationToken);

            var allScores = await _context.QuizAttempts
                .Where(a => a.QuizId == attempt.QuizId && a.Status != AttemptStatus.InProgress)
                .Select(a => a.Score)
                .ToListAsync(cancellationToken);

            var (average, _, percentile) = _statisticsService.AnalyzeScore(attempt.Score, allScores);

            return new AttemptResultDto(attempt.Id, attempt.Score, attempt.Status.ToString(), average, percentile);
        }
    }

}
