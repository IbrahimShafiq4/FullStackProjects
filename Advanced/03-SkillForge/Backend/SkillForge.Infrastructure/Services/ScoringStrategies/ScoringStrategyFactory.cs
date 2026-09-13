using SkillForge.Application.Interfaces;
using SkillForge.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Infrastructure.Services.ScoringStrategies
{

    public class ScoringStrategyFactory: IScoringStrategyFactory
    {
        private readonly Dictionary<QuestionType, IScoringStrategy> _strategies;

        public ScoringStrategyFactory()
        {
            _strategies = new Dictionary<QuestionType, IScoringStrategy>
            {
                [QuestionType.SingleChoice] = new SingleChoiceScoringStrategy(),
                [QuestionType.MultipleChoice] = new MultipleChoiceScoringStrategy(),
            };
        }

        public IScoringStrategy GetStrategy(QuestionType type) => _strategies[type];
    }
}
