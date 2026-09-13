using SkillForge.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Domain.Entities
{
    public class QuizAttempt
    {
        public int                      Id          { get; set; }
        public DateTime                 StartedAt   { get; set; } = DateTime.UtcNow;
        public DateTime?                SubmittedAt { get; set; }
        public AttemptStatus            Status      { get; set; } = AttemptStatus.InProgress;
        public double                   Score       { get; set; }
        public int                      QuizId      { get; set; }
        public Quiz                     Quiz        { get; set; } = null!;
        public int                      CandidateId { get; set; }
        public Candidate                Candidate   { get; set; } = null!;
        public List<CandidateAnswer>    Answers     { get; set; } = new();
    }
}
