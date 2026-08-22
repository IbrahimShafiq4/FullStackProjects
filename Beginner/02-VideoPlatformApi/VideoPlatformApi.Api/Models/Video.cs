using System.ComponentModel.DataAnnotations;
using VideoPlatformApi.Models;

namespace VideoPlatformApi.Api.Models
{
    public class Video: BaseEntity
    {
        // ===========              Video Title                       ===========
        [Required(              ErrorMessage = "Title Is Required")]
        [MaxLength(200,         ErrorMessage = "Title cannot exceed 200 characters")]
        public string           Title { get; set; } = string.Empty;
        // ======================================================================

        // ===========              Video Description                 ===========
        [Required(              ErrorMessage = "Video Description is Required")]
        [MaxLength(1000,        ErrorMessage = "Description cannot exceed 1000 characters")]
        public string           Description { get; set; } = string.Empty;

        // ======================================================================

        [Required(ErrorMessage = "Video URL is required")]
        public string           VideoUrl        { get; set; } = string.Empty;

        // ======================================================================
        public string?          ThumbnailUrl    { get; set; }

        // ======================================================================
        [Required(ErrorMessage = "Category is required")]
        public string           Category        { get; set; } = string.Empty;
        // ======================================================================

        public int              Views           { get; set; } = 0;
        // ======================================================================

        public int              LikesCount      { get; set; } = 0;
        // ======================================================================

        public DateTime         UploadedAt      { get; set; } = DateTime.UtcNow;
        // ======================================================================

        public int              UserId          { get; set; }
        // ======================================================================

        // ===========          Navigational Properties               ===========
        public User?            User            { get; set; }
        // ======================================================================
        public List<Comment>    Comments        { get; set; } = new();
        public List<Like>       Likes           { get; set; } = new();
        // ======================================================================
    }
}
