namespace ChatterHub.API.DTOs
{
    public record RoomDto           (int Id, string Name, string Topic, DateTime LastActivityAt, int MessagesCount);
    public record MessageDto        (int Id, string content, DateTime SentAt, string SenderName, string? AttachmentUrl);
    public record CreateRoomRequest (string Name, string Topic);
}
