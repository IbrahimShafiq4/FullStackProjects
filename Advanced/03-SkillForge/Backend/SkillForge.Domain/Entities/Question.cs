using SkillForge.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Domain.Entities
{
    public class Question
    {
        public int                  Id      { get; set; }
        public string               Text    { get; set; } = string.Empty;
        public QuestionType         Type    { get; set; }
        public int                  Points  { get; set; } = 1;
        public int                  QuizId  { get; set; }
        public Quiz                 Quiz    { get; set; } = null!;

        public List<AnswerOption>   Options { get; set; } = new();
    }
}
