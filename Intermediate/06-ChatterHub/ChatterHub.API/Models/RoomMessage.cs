namespace ChatterHub.API.Models
{
    public class RoomMessage
    {
        public int      Id              { get; set; }
        public string   Content         { get; set; } = string.Empty;
        public string?  AttachmentUrl   { get; set; }
        public DateTime SentAt          { get; set; } = DateTime.UtcNow;
        public int      RoomId          { get; set; }
        public Room     Room            { get; set; } = null!;
        public string   SenderId        { get; set; } = string.Empty;
        public AppUser  Sender          { get; set; } = null!;
    }
}
