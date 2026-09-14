using System;
using System.Collections.Generic;
using System.Text;

namespace ShelfLife.Domain.Entities
{
    public class ActivityItem
    {
        public int      Id          { get; set; }
        public string   UserName    { get; set; } = string.Empty;
        public string   UserInitial { get; set; } = string.Empty;
        public string   Action      { get; set; } = string.Empty;
        public string   City        { get; set; } = string.Empty;
        public DateTime CreatedAt   { get; set; } = DateTime.UtcNow;
    }
}
