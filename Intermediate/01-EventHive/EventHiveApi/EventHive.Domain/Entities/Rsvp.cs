using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Domain.Entities
{
    public class Rsvp
    {
        public int      Id          { get; set; }
        public string   AttendeeId  { get; set; } = string.Empty;
        public AppUser  Attendee    { get; set; } = null!;

        public int      EventId     { get; set; }
        public Event    Event       { get; set; } = null!;

        public DateTime CreatedAt   { get; set; } = DateTime.UtcNow;
        public bool     IsConfirmed { get; set; } = true;
    }
}
