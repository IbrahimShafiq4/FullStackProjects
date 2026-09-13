using SkillForge.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Interfaces
{
    public interface IScoringStrategy 
    { double CalculateScore(Question question, List<int> SelectedOptionIds); }
}
