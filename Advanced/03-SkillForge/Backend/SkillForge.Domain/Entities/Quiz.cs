using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Domain.Entities
{
    public class Quiz
    {
        public int                  Id                  { get; set; }
        public string               Title               { get; set; } = string.Empty;
        public int                  DurationMinutes     { get; set; }
        public                      DateTime CreatedAt  { get; set; } = DateTime.UtcNow;

        public int                  CompanyId           { get; set; }
        public Company              Company             { get; set; } = null!;

        public List<Question>       Questions           { get; set; } = new();
        public List<QuizAttempt>    Attempts            { get; set; } = new();
    }
}
