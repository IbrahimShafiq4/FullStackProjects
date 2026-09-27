using SignalDesk.DAL.Models.Enums;

namespace SignalDesk.BLL.DTOs.Tickets
{
    public class UpdateTicketStatusDto
    {
        public TicketStatus Status { get; set; }
    }
}