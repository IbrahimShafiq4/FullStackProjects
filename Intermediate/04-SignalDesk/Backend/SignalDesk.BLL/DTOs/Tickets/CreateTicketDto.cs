using SignalDesk.DAL.Models.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SignalDesk.BLL.DTOs.Tickets
{
    public class CreateTicketDto
    {
        public string Subject { get; set; } = string.Empty;
        public TicketPriority Priority { get; set; }
    }
}
