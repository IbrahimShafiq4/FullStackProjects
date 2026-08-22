using VideoPlatformApi.Api.Models;

namespace VideoPlatformApi.Models
{
    public class Like
    {
        public int Id { get; set; }

        public int VideoId { get; set; }
        public int UserId { get; set; }

        public DateTime LikedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Video? Video { get; set; }
        public User? User { get; set; }
    }
}