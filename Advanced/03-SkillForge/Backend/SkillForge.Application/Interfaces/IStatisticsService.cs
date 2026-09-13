using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Application.Interfaces
{
    public interface IStatisticsService
    {
        (
            double average,
            double stdDeviation,
            double percentile)
            AnalyzeScore(double candidateScore, List<double> allScores);
    }
}
