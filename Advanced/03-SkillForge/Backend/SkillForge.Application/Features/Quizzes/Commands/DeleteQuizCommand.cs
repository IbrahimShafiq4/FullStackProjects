using MediatR;
using SkillForge.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Quizzes.Commands
{
    public record DeleteQuizCommand(int QuizId, int CompanyId) : IRequest<bool>;

    public class DeleteQuizHandler: IRequestHandler<DeleteQuizCommand, bool>
    {
        private readonly IAppDbContext _context;
        public DeleteQuizHandler(IAppDbContext context)
        { _context = context; }

        public async Task<bool> Handle(DeleteQuizCommand request, CancellationToken cancellationToken)
        {
            var quiz = await _context.Quizzes.FindAsync(new object[] { request.QuizId }, cancellationToken);

            if (quiz is null || quiz.CompanyId != request.CompanyId) return false;

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
