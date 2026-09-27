namespace SignalDesk.BLL.DTOs.Tickets
{
    public class TicketNoteDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string AuthorName { get; set; } = string.Empty;
    }

    public class CreateTicketNoteDto
    {
        public string Content { get; set; } = string.Empty;
    }
}