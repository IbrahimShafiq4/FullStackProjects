using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class StoryView
    {
        public int      Id          { get; set; }
        public DateTime ViewedAt    { get; set; } = DateTime.UtcNow;
        public int      StoryId     { get; set; }
        public Story    Story       { get; set; } = null!;
        public string   ViewerId    { get; set; } = string.Empty;
    }
}
