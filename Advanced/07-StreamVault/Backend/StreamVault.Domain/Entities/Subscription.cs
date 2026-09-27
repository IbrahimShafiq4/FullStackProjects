using System;
using System.Collections.Generic;
using System.Text;

namespace StreamVault.Domain.Domain
{
    public class Subscription
    {
        public int      Id              { get; set; }
        public DateTime StartedAt       { get; set; } = DateTime.UtcNow;
        public int      DurationDays    { get; set; } = 30;
        public string   SubscriberId    { get; set; } = string.Empty;
    }
}
