using MediatR;
using SkillForge.Application.Interfaces;
using SkillForge.Domain.Entities;
using SkillForge.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Quizzes.Commands
{
    public record AddQuestionCommand(int QuizId, string Text, string Type, int Points, List<(string Text, bool IsCorrect)> Options) : IRequest<int>;

    public class AddQuestionHandler: IRequestHandler<AddQuestionCommand, int>
    {
        private readonly IAppDbContext _context;
        public AddQuestionHandler(IAppDbContext context)
        { _context = context; }

        public async Task<int> Handle(AddQuestionCommand request, CancellationToken cancellationToken)
        {
            if (!Enum.TryParse<QuestionType>(request.Type, true, out var type))
                throw new InvalidOperationException("نوع السؤال غير صحيح");

            var question = new Question
            {
                QuizId  = request.QuizId,
                Text    = request.Text,
                Type    = type,
                Points  = request.Points,
                Options = request.Options.Select(o => new AnswerOption
                {
                    Text = o.Text,
                    IsCorrect = o.IsCorrect
                }).ToList()
            };

            _context.Questions.Add(question);
            await _context.SaveChangesAsync(cancellationToken);
            return question.Id;
        }
    }
}
