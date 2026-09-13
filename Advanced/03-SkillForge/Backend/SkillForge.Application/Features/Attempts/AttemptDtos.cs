using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Features.Attempts
{
    public record StartAttemptResponse(int AttemptId, DateTime StartedAt, DateTime MustSubmitBy);
    public record SubmitAnswerRequest(int QuestionId, List<int> SelectedOptionIds);
    public record SubmitAttemptRequest(List<SubmitAnswerRequest> Answers);
    public record AttemptResultDto(int AttemptId, double Score, string Status, double AverageScore, double PercentileRank);
    public record StartAttemptResult(
    int AttemptId,
    DateTime StartedAt,
    DateTime MustSubmitBy
);
}
