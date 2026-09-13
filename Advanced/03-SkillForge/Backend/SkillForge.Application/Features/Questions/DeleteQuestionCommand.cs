using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Interfaces;

namespace SkillForge.Application.Features.Quizzes.Commands
{
    public record DeleteQuestionCommand(int QuestionId) : IRequest<bool>;

    public class DeleteQuestionHandler : IRequestHandler<DeleteQuestionCommand, bool>
    {
        private readonly IAppDbContext _context;
        public DeleteQuestionHandler(IAppDbContext context)
        { _context = context; }

        public async Task<bool> Handle(DeleteQuestionCommand request, CancellationToken cancellationToken)
        {
            var question = await _context.Questions
                .Include(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == request.QuestionId, cancellationToken);

            if (question is null) return false;

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}