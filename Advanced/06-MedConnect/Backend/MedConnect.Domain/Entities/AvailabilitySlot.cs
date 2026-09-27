using System;
using System.Collections.Generic;
using System.Text;

namespace MedConnect.Domain.Entities
{
    public class AvailabilitySlot
    {
        public int          Id          { get; set; }
        public DayOfWeek    DayOfWeek   { get; set; }
        public TimeSpan     StartTime   { get; set; }
        public TimeSpan     EndTime     { get; set; }

        public string       DoctorId    { get; set; } = string.Empty;
        public Doctor       Doctor      { get; set; } = null!;
    }
}
