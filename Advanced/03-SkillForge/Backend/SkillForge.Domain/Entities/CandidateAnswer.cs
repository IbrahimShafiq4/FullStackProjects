using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Domain.Entities
{
    public class CandidateAnswer
    {
        public int          Id                  { get; set; }
        public int          QuizAttemptId       { get; set; }
        public QuizAttempt  QuizAttempt         { get; set; } = null!;

        public int          QuestionId          { get; set; }
        public Question     Question            { get; set; } = null!;

        public List<int>    SelectedOptionIds   { get; set; } = new();
    }
}
