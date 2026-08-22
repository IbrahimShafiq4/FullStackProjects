using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Domain.Entities
{
    public class Event
    {
        public int Id { get; set; }

        public string               Title       { get; set; } = string.Empty;
        public string?              Description { get; set; }
        public DateTime             StartDate   { get; set; }
        public DateTime             EndDate     { get; set; }
        public int                  Capcity     { get; set; }
        public string?              Location    { get; set; }

        public string               OrganizerId { get; set; } = string.Empty;
        public AppUser              Organizer   { get; set; } = null!;

        public ICollection<Rsvp>    Rsvps       { get; set; } = new List<Rsvp>();

        public DateTime             CreatedAt   { get; set; } = DateTime.UtcNow;
        public bool                 IsActive    { get; set; } = true;
    }
}
