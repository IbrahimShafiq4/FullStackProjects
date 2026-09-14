using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Domain.Entities
{
    public class Event
    {
        public int          Id          { get; set; }
        public string       Title       { get; set; } = string.Empty;
        public DateTime     EventDate   { get; set; }
        public decimal      BasePrice   { get; set; }
        public int          VenueId     { get; set; }
        public Venue        Venue       { get; set; } = null!;
        public string       OrganizerId { get; set; } = string.Empty;
        public AppUser      Organizer   { get; set; } = null!;
        public List<Seat>   Seats       { get; set; } = new();
    }
}
