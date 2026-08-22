namespace VideoPlatformApi.Api.DTOs
{
    public class VideoDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public string Category { get; set; } = string.Empty;
        public int Views { get; set; }
        public DateTime UploadedAt { get; set; }
        public string Username { get; set; } = string.Empty;
        public int CommentCount { get; set; }
        public int LikeCount { get; set; }
        public IEnumerable<CommentDto> Comments { get; set; } = new List<CommentDto>();
    }
}
