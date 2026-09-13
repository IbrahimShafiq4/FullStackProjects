using SkillForge.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Interfaces
{
    public interface IScoringStrategyFactory
    { IScoringStrategy GetStrategy(QuestionType type); }
}
