namespace VideoPlatformApi.Api.Services.FileServiceControl
{
    public interface IFileService
    {
        Task<string> SaveVideoAsync(IFormFile file);
        Task<string> SaveImageAsync(IFormFile file, int maxWidth = 800);
        Task DeleteFileAsync(string filePath);
        bool IsVideoFile(IFormFile file);
        bool IsImageFile(IFormFile file);
        bool IsValidVideoSize(IFormFile file);
        bool IsValidImageSize(IFormFile file);
    }
}
