using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Features.Quizzes;
using SkillForge.Application.Interfaces;
using SkillForge.Domain.Enums;

namespace SkillForge.Application.Features.Quizzes.Queries
{
    public record GetAvailableQuizzesQuery(string UserId) : IRequest<List<QuizDto>>;

    public class GetAvailableQuizzesHandler : IRequestHandler<GetAvailableQuizzesQuery, List<QuizDto>>
    {
        private readonly IAppDbContext _context;
        public GetAvailableQuizzesHandler(IAppDbContext context)
        { _context = context; }

        public async Task<List<QuizDto>> Handle(GetAvailableQuizzesQuery request, CancellationToken cancellationToken)
        {
            var candidate = await _context.Candidates
                .FirstOrDefaultAsync(c => c.UserId == request.UserId, cancellationToken);

            var completedQuizIds = candidate is null
                ? new List<int>()
                : await _context.QuizAttempts
                    .Where(a => a.CandidateId == candidate.Id && a.Status != AttemptStatus.InProgress)
                    .Select(a => a.QuizId)
                    .ToListAsync(cancellationToken);

            return await _context.Quizzes
                .Where(q => q.Questions.Count > 0 && !completedQuizIds.Contains(q.Id))
                .Select(q => new QuizDto(q.Id, q.Title, q.DurationMinutes, q.Questions.Count))
                .ToListAsync(cancellationToken);
        }
    }
}