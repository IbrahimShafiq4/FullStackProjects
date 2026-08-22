using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Application.DTOs.Events
{
    public class RsvpDto
    {
        public string   AttendeeId      { get; set; } = string.Empty;
        public string   AttendeeName    { get; set; } = string.Empty;
        public DateTime CreatedAt       { get; set; }
        public bool     IsConfirmed     { get; set; }
    }
}
