using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class ProfileVisit
    {
        public int      Id              { get; set; }
        public string   VisitorId       { get; set; } = string.Empty;
        public string   VisitedUserId   { get; set; } = string.Empty;
        public DateTime VisitedAt       { get; set; } = DateTime.UtcNow;
    }
}
