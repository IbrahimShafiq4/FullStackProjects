namespace ChatterHub.API.Models
{
    public class Room
    {
        public int                  Id              { get; set; }
        public string               Name            { get; set; } = string.Empty;
        public string               Topic           { get; set; } = string.Empty;
        public DateTime             CreatedAt       { get; set; } = DateTime.UtcNow;
        public DateTime             LastActivityAt  { get; set; } = DateTime.UtcNow;
        public List<RoomMessage>    Messages        { get; set; } = new();
    }
}
