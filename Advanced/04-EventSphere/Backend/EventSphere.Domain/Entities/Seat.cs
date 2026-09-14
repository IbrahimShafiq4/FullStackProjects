using EventSphere.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Domain.Entities
{
    public class Seat
    {
        public int          Id          { get; set; }
        public int          Row         { get; set; }
        public int          Number      { get; set; }
        public SeatStatus   Status      { get; set; } = SeatStatus.Available;
        public DateTime?    LockedUntil { get; set; }
        public int          EventId     { get; set; }
        public Event        Event       { get; set; } = null!;
    }
}
