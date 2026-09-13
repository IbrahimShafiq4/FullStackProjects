using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Application.DTOs.Landing
{
    public class CategoryDto
    {
        public string   Name        { get; set; } = string.Empty;
        public string   Icon        { get; set; } = string.Empty;
        public string   Description { get; set; } = string.Empty;
        public int      EventCount  { get; set; }
    }
}
