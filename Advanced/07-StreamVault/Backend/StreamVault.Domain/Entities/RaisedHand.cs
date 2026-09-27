using System;
using System.Collections.Generic;
using System.Text;

namespace StreamVault.Domain.Entities
{
    public enum HandStatus { Pending = 1, Approved = 2, Rejected = 3 }
    public class RaisedHand
    {
        public int          Id              { get; set; }
        public HandStatus   status          { get; set; } = HandStatus.Pending;
        public DateTime     RaisedAt        { get; set; } = DateTime.UtcNow;

        public int          LiveSessionId   { get; set; }
        public LiveSession  LiveSession     { get; set; } = null!;
        public string       StudentId       { get; set; } = string.Empty;
        public string       StudentName     { get; set; } = string.Empty;
    }
}
