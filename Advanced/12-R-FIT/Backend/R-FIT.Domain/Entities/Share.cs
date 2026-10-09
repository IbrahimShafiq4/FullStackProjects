using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class Share
    {
        public int          Id                  { get; set; }
        public string?      AdditionalComment   { get; set; }
        public DateTime?    ScheduledAt         { get; set; }
        public DateTime     CreatedAt           { get; set; } = DateTime.UtcNow;
                            
        public int          OriginalPostId      { get; set; }
        public Post         OriginalPost        { get; set; } = null!;
        public string       SharedById          { get; set; } = string.Empty;
    }
}
