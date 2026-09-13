using MathNet.Numerics.Statistics;
using SkillForge.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Infrastructure.Services
{
    public class StatisticsService: IStatisticsService
    {
        public (double average, double stdDeviation, double percentile) AnalyzeScore(double candidateScore, List<double> allScores)
        {
            if (allScores.Count == 0) return (0, 0, 0);

            var average = allScores.Average();
            var stdDeviation = allScores.StandardDeviation();

            var betterThanCount = allScores.Count(s => s < candidateScore);
            var percentile = allScores.Count > 0 ? (double)betterThanCount / allScores.Count * 100 : 0;

            return (average, stdDeviation, percentile);
        }
    }
}
