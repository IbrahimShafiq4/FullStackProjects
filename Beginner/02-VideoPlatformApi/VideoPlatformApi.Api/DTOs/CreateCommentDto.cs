namespace VideoPlatformApi.Api.DTOs
{
    public class CreateCommentDto
    {
        public string Content { get; set; } = string.Empty;
        public int VideoId { get; set; }
        public int UserId { get; set; }
    }
}
