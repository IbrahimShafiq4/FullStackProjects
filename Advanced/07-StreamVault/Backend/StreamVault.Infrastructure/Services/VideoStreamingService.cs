using Microsoft.AspNetCore.Mvc;

namespace StreamVault.Infrastructure.Services
{
    public interface IVideoStreamingService { FileStreamResult GetVideoStream(string filePath, string contentType); };
    public class VideoStreamingService: IVideoStreamingService
    {
        public FileStreamResult GetVideoStream(string filePath, string contentType)
        {
            var stream = new FileStream(
                filePath,
                FileMode.Open,
                FileAccess.Read,
                FileShare.Read
            );

            return new FileStreamResult(stream, contentType) { EnableRangeProcessing = true };
        }
    }
}
