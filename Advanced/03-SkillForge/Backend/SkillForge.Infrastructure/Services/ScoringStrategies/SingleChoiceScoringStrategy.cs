using SkillForge.Application.Interfaces;
using SkillForge.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Infrastructure.Services.ScoringStrategies
{
    public class SingleChoiceScoringStrategy: IScoringStrategy
    {
        public double CalculateScore(Question question, List<int> selectedOptionIds)
        {
            if (selectedOptionIds.Count != 1) return 0;

            var correctedOptionsId = question.Options.FirstOrDefault(o => o.IsCorrect)?.Id;
            return selectedOptionIds[0] == correctedOptionsId ? 1.0 : 0.0;
        }
    }
}
