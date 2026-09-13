using System;
using System.Collections.Generic;
using System.Text;

namespace SignalDesk.BLL.DTOs.Messages
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string? AttachmentUrl { get; set; }
    }
}
