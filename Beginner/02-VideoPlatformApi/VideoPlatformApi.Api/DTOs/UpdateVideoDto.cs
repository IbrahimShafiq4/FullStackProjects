namespace VideoPlatformApi.Api.DTOs
{
    public class UpdateVideoDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public IFormFile? VideoFile { get; set; }
        public IFormFile? ThumbnailFile { get; set; }
    }
}
