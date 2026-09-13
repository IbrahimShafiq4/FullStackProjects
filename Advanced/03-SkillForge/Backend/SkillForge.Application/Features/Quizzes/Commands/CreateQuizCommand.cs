using MediatR;
using SkillForge.Application.Interfaces;
using SkillForge.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Quizzes.Commands
{
    public record CreateQuizCommand(int CompanyId, string Title, int DurationMinutes): IRequest<int>;

    public class CreateQuizHandler: IRequestHandler<CreateQuizCommand, int>
    {
        private readonly IAppDbContext _context;
        public CreateQuizHandler(IAppDbContext context)
        { _context = context; }

        public async Task<int> Handle(CreateQuizCommand request, CancellationToken cancellationToken)
        {
            var quiz = new Quiz
            {
                CompanyId       = request.CompanyId,
                Title           = request.Title,
                DurationMinutes = request.DurationMinutes
            };

            _context.Quizzes.Add(quiz);

            await _context.SaveChangesAsync(cancellationToken);
            return quiz.Id;
        }
    }
}
