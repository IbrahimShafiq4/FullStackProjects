using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Domain.Entities
{
    public class Testimonial
    {
        public int      Id          { get; set; }
        public string   Name        { get; set; } = string.Empty;
        public string   Role        { get; set; } = string.Empty;
        public string   City        { get; set; } = string.Empty;
        public string   Message     { get; set; } = string.Empty;
        public string   Hieroglyph  { get; set; } = "𓂀";
        public int      Rating      { get; set; } = 5;
        public bool     IsPublished { get; set; } = true;
        public DateTime CreatedAt   { get; set; } = DateTime.UtcNow;
    }
}
