namespace VideoPlatformApi.Api.DTOs
{
    public class LikeDto
    {
        public int VideoId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public DateTime LikedAt { get; set; }
    }
}
