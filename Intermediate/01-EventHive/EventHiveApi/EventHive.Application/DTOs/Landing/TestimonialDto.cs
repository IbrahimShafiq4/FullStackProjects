using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Application.DTOs.Landing
{
    public class TestimonialDto
    {
        public string   Name    { get; set; } = string.Empty;
        public string   Role    { get; set; } = string.Empty;
        public string   Message { get; set; } = string.Empty;
        public string   Avatar  { get; set; } = string.Empty;
        public int      Rating  { get; set; }
    }
}
