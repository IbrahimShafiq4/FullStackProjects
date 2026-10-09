using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class DirectMessage
    {
        public int      Id          { get; set; }
        public string   Content     { get; set; } = string.Empty;
        public bool     IsRead      { get; set; } = false;
        public DateTime SentAt      { get; set; } = DateTime.UtcNow;
        public string   SenderId    { get; set; } = string.Empty;
        public AppUser  Sender      { get; set; } = null!;
    }
}
