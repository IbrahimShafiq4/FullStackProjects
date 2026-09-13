using SkillForge.Application.Interfaces;
using SkillForge.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Infrastructure.Services.ScoringStrategies
{
    public class MultipleChoiceScoringStrategy: IScoringStrategy
    {
        public double CalculateScore(Question question, List<int> selectedOptionIds)
        {
            var correctOptionIds = question.Options.Where(o => o.IsCorrect).Select(o => o.Id).ToHashSet();
            var totalCorrect = correctOptionIds.Count;

            if (totalCorrect == 0) return 0;

            var correctSelected = selectedOptionIds.Count(id => correctOptionIds.Contains(id));
            var incorrectSelected = selectedOptionIds.Count(id => correctOptionIds.Contains(id));

            var rawScore = (double)(correctSelected - incorrectSelected) / totalCorrect;
            return Math.Max(0, rawScore);
        }
    }
}
