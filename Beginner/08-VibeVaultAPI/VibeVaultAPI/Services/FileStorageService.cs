using VibeVaultAPI.Models;

namespace VibeVaultAPI.Services
{
    public interface IFileStorageService
    {
        Task<(string url, MediaType type)> SaveMediaAsync(IFormFile file);
    }

    public class FileStorageService: IFileStorageService
    {
        private readonly IWebHostEnvironment _env;

        private readonly string[] _imageExtensions = { ".jpg", ".jpeg", ".png"  };
        private readonly string[] _videoExtensions = { ".mp4", ".webm"          };

        private const long MaxImageSize = 100   * 1024 * 1024;
        private const long MaxVideoSize = 2000  * 1024 * 1024;
        public FileStorageService(IWebHostEnvironment env)
        { _env = env; }

        public async Task<(string url, MediaType type)> SaveMediaAsync(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            MediaType mediaType;
            string subFolder;
            long maxSize;

            if          (_imageExtensions.Contains(extension))
            {
                mediaType   = MediaType.Image;
                subFolder   = "images";
                maxSize     = MaxImageSize;
            }
            else if     (_videoExtensions.Contains(extension))
            {
                mediaType   = MediaType.Video;
                subFolder   = "videos";
                maxSize     = MaxVideoSize;
            }
            else
            {
                throw new InvalidOperationException("نوع الملف غير مدعوم المسموح: .jpeg, .png, .jpg, .mp4, .webm");
            }

            if (file.Length > maxSize)
            {
                var maxMb = maxSize / (1024 * 1024);
                throw new InvalidOperationException($"حجم الملف يتخطى الحد الأقصى المسموح به {maxMb}mb");
            }

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", subFolder);

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var url = $"/uploads/{subFolder}/{uniqueFileName}";
            return (url, mediaType);
        }
    }
}
