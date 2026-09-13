using SignalDesk.DAL.Models.Enums;

namespace SignalDesk.DAL.Models 
{
    public class TicketMessage
    {
        public int Id                   { get; set; }
        public string Content           { get; set; } = string.Empty;
        public DateTime SentAt          { get; set; } = DateTime.UtcNow;

        public bool IsRead              { get; set; } = false;

        public string SenderId          { get; set; } = string.Empty;
        public AppUser Sender           { get; set; } = null!;

        public int TicketId             { get; set; }
        public Ticket Ticket            { get; set; } = null!;

        public string? AttachmentUrl    { get; set; }
    }
}
