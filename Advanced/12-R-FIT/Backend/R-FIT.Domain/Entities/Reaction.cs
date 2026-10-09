using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public enum ReactionType
    {
        Like    = 1,
        Love    = 2,
        Haha    = 3,
        Wow     = 4,
        Sad     = 5,
        Angry   = 6
    }
    public class Reaction
    {
        public int          Id      { get; set; }
        public ReactionType Type    { get; set; }
        public int          PostId  { get; set; }
        public Post         Post    { get; set; } = null!;
        public string       UserId  { get; set; } = string.Empty;
    }
}
