using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Application.DTOs.Events
{
    public class CreateEventDto
    {
        public string   Title       { get; set; } = string.Empty;
        public string?  Description { get; set; }
        public DateTime StartDate   { get; set; }
        public DateTime EndDate     { get; set; }
        public int      Capcity     { get; set; }
        public string?  Location    { get; set; }
    }
}
