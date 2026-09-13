using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Quizzes
{
    public record OptionDto(int Id, string Text);
    public record QuestionDto(int Id, string Text, string Type, int Points, List<OptionDto> Options);
    public record QuizDto(int Id, string Title, int DurationMinutes, int QuestionsCount);
    public record QuizWithQuestionsDto(int Id, string Title, int DurationMinutes, List<QuestionDto> Questions);

    public record CreateQuizRequest(int CompanyId, string Title, int DurationMinutes);
    public record CreateQuestionRequest(string Text, string Type, int Points, List<CreateOptionRequest> Options);
    public record CreateOptionRequest(string Text, bool IsCorrect);
}
