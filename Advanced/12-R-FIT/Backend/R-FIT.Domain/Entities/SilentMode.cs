using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class SilentMode
    {
        public int      Id              { get; set; }
        public string   UserId          { get; set; } = string.Empty;
        public DateTime StartedAt       { get; set; } = DateTime.UtcNow;
        public DateTime EndsAt          { get; set; }
        public string?  StatusMessage   { get; set; }
    }
}
