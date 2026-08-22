namespace VideoPlatformApi.Api.DTOs
{
    public class CreateVideoDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public IFormFile VideoFile { get; set; } = null!;
        public IFormFile? ThumbnailFile { get; set; }
        public int UserId { get; set; }
    }
}
