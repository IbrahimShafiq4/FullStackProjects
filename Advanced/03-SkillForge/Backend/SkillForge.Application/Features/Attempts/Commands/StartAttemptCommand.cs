using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Interfaces;
using SkillForge.Domain.Entities;
using SkillForge.Domain.Enums;

namespace SkillForge.Application.Features.Attempts.Commands
{
    public record StartAttemptCommand(int QuizId, string UserId) : IRequest<StartAttemptResponse>;

    public class StartAttemptHandler : IRequestHandler<StartAttemptCommand, StartAttemptResponse>
    {
        private readonly IAppDbContext _context;
        public StartAttemptHandler(IAppDbContext context)
        { _context = context; }

        public async Task<StartAttemptResponse> Handle(StartAttemptCommand request, CancellationToken cancellationToken)
        {
            var candidate = await _context.Candidates
                .FirstOrDefaultAsync(c => c.UserId == request.UserId, cancellationToken)
                ?? throw new InvalidOperationException("المرشح غير موجود.");

            var quiz = await _context.Quizzes
                .FindAsync(new object[] { request.QuizId }, cancellationToken)
                ?? throw new InvalidOperationException("الاختبار غير موجود.");

            var existingAttempt = await _context.QuizAttempts
                .FirstOrDefaultAsync(qa =>
                    qa.QuizId == request.QuizId &&
                    qa.CandidateId == candidate.Id &&
                    qa.Status == AttemptStatus.InProgress,
                    cancellationToken);

            if (existingAttempt is not null)
                return new StartAttemptResponse(
                    existingAttempt.Id,
                    existingAttempt.StartedAt,
                    existingAttempt.StartedAt.AddMinutes(quiz.DurationMinutes));

            var attempt = new QuizAttempt
            {
                QuizId = request.QuizId,
                CandidateId = candidate.Id
            };

            _context.QuizAttempts.Add(attempt);
            await _context.SaveChangesAsync(cancellationToken);

            return new StartAttemptResponse(
                attempt.Id,
                attempt.StartedAt,
                attempt.StartedAt.AddMinutes(quiz.DurationMinutes));
        }
    }
}