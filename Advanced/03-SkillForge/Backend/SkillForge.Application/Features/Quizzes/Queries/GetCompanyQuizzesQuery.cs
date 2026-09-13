using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Quizzes.Queries
{
    public record GetCompanyQuizzesQuery(int CompanyId) : IRequest<List<QuizDto>>;

    public class GetCompanyQuizzesHandler: IRequestHandler<GetCompanyQuizzesQuery, List<QuizDto>>
    {
        private readonly IAppDbContext _context;
        public GetCompanyQuizzesHandler(IAppDbContext context)
        { _context = context; }

        public async Task<List<QuizDto>> Handle(GetCompanyQuizzesQuery request, CancellationToken cancellationToken) =>
            await _context.Quizzes
                    .Where(q => q.CompanyId == request.CompanyId)
                    .Select
                    (q => new QuizDto(
                        q.Id,
                        q.Title,
                        q.DurationMinutes,
                        q.Questions.Count
                    ))
                    .ToListAsync(cancellationToken);
    }
}
