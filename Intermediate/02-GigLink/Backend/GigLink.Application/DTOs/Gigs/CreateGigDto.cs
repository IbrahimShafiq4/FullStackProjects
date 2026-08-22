using System;
using System.Collections.Generic;
using System.Text;

namespace GigLink.Application.DTOs.Gigs
{
    public class CreateGigDto
    {
        public string   Title       { get; set; } = string.Empty;
        public string   Description { get; set; } = string.Empty;
        public decimal  Budget      { get; set; }
    }
}
