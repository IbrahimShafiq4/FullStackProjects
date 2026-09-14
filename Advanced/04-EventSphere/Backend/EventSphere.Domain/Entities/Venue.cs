using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Domain.Entities
{
    public class Venue
    {
        public int          Id          { get; set; }
        public string       Name        { get; set; } = string.Empty;
        public string       Address     { get; set; } = string.Empty;
        public int          TotalRows   { get; set; }
        public int          SeatsPerRow { get; set; } 

        public List<Event>  Events      { get; set; } = new();
    }
}
