using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Domain.Entities
{
    public class Candidate
    {
        public int                  Id          { get; set; }
        public string               FullName    { get; set; } = string.Empty;
        public string               Email       { get; set; } = string.Empty;
        public string               UserId      { get; set; } = string.Empty;
        public List<QuizAttempt>    Attempts    { get; set; } = new();
    }
}
