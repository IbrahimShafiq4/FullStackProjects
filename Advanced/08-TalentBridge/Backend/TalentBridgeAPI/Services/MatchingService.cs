using TalentBridgeAPI.Models;

namespace TalentBridgeAPI.Services
{
    public interface IMatchingService 
    { 
        double CalculateMatchScore(
            List<CandidateSkill>        candidateSkills, 
            List<JobSkillRequirement>   jobRequirements
        ); 
    }

    public class MatchingService : IMatchingService
    {
        private const double MustHaveWeight     = 3.0;
        private const double NiceToHaveWeight   = 1.0;

        public double CalculateMatchScore(List<CandidateSkill> candidateSkills, List<JobSkillRequirement> jobRequirements)
        {
            if (jobRequirements.Count == 0) return 0;

            var candidateSkillSet = candidateSkills.Select(s => s.SkillName.ToLower().Trim()).ToHashSet();

            double totalPossibleScore = 0;
            double achievedScore = 0;

            foreach (var requirement in jobRequirements)
            {
                var weight = requirement.Importance == SkillImportance.MustHave ? MustHaveWeight : NiceToHaveWeight;
                totalPossibleScore += weight;

                if (candidateSkillSet.Contains(requirement.SkillName.ToLower().Trim()))
                {
                    achievedScore += weight;
                }
            }

            return totalPossibleScore > 0 ? Math.Round((achievedScore / totalPossibleScore) * 100, 1) : 0;
        }
    }
}
