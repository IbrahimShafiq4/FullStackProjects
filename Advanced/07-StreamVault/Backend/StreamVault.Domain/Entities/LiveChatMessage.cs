using System;
using System.Collections.Generic;
using System.Text;

namespace StreamVault.Domain.Entities
{
    public class LiveChatMessage
    {
        public int              Id              { get; set; }
        public string           Content         { get; set; } = string.Empty;
        public DateTime         SentAt          { get; set; } = DateTime.UtcNow;

        public int              LiveSessionId   { get; set; }
        public LiveSession      LiveSession     { get; set; } = null!;
        public string           SenderId        { get; set; } = string.Empty;
        public string           SenderName      { get; set; } = string.Empty;
    }
}
