using System.ComponentModel.DataAnnotations;
using VideoPlatformApi.Api.Models;

namespace VideoPlatformApi.Models
{
    public class Comment
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Comment content is required")]
        [MaxLength(500, ErrorMessage = "Comment cannot exceed 500 characters")]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public int VideoId { get; set; }
        public int UserId { get; set; }

        // Navigation Properties
        public Video? Video { get; set; }
        public User? User { get; set; }
    }
}