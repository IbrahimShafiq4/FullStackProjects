using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class Block
    {
        public int      Id        { get; set; }
        public string   BlockerId { get; set; } = string.Empty;
        public string   BlockedId { get; set; } = string.Empty;
        public DateTime BlockedAt { get; set; } = DateTime.UtcNow;
    }
}
