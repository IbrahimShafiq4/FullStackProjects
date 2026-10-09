using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class QuietHoursSetting
    {
        public int      Id          { get; set; }
        public string   UserId      { get; set; } = string.Empty;
        public TimeSpan StartTime   { get; set; }
        public TimeSpan EndTime     { get; set; }
        public bool     IsEnabled   { get; set; } = true;
    }
}
