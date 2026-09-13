using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Application.DTOs.Landing
{
    public class LandingStatsDto
    {
        public int TotalEvents      { get; set; }
        public int TotalAttendees   { get; set; }
        public int TotalOrganizers  { get; set; }
        public int TotalCities      { get; set; }
        public int UpcomingEvents   { get; set; }
        public int TotalRsvps       { get; set; }
    }
}
