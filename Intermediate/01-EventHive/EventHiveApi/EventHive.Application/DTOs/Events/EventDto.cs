using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Application.DTOs.Events
{
    public class EventDto
    {
        public int              Id              { get; set; }
        public string           Title           { get; set; } = string.Empty;
        public string?          Description     { get; set; }
        public DateTime         StartDate       { get; set; }
        public DateTime         EndDate         { get; set; }
        public int              Capcity         { get; set; }
        public int              AvailableSpots  { get; set; }
        public string?          Location        { get; set; }
        public string           OrganizerName   { get; set; } = string.Empty;
        public bool             IsActive        { get; set; }
        public List<RsvpDto>    Rsvps           { get; set; } = new();
    }
}
