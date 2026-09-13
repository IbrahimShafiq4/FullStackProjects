using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Quizzes.Queries
{
    public record GetQuizForCandidateQuery(int QuizId) : IRequest<QuizWithQuestionsDto?>;
    public class GetQuizCandidateHandler: IRequestHandler<GetQuizForCandidateQuery, QuizWithQuestionsDto?>
    {
        private readonly IAppDbContext _context;
        public GetQuizCandidateHandler(IAppDbContext context)
        { _context = context; }

        public async Task<QuizWithQuestionsDto?> Handle(GetQuizForCandidateQuery request, CancellationToken cancellationToken)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions).ThenInclude(qq => qq.Options)
                .FirstOrDefaultAsync(q => q.Id == request.QuizId, cancellationToken);

            if (quiz == null) return null;

            return new QuizWithQuestionsDto(quiz.Id, quiz.Title, quiz.DurationMinutes,
                quiz.Questions.Select(qq => new QuestionDto(qq.Id, qq.Text, qq.Type.ToString(), qq.Points,
                    qq.Options.Select(o => new OptionDto(o.Id, o.Text)).ToList())).ToList());
        }
    }
}
