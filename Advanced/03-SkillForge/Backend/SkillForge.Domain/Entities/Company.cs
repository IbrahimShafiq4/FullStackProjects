using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Domain.Entities
{
    public class Company
    {
        public int          Id      { get; set; }
        public string       Name    { get; set; } = string.Empty;
        public string       OwnerId { get; set; } = string.Empty;
        public List<Quiz>   Quizzes { get; set; } = new();
    }
}
