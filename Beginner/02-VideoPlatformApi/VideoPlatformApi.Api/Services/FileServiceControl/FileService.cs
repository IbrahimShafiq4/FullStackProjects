using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace VideoPlatformApi.Api.Services.FileServiceControl
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly string[] _allowedVideoExtensions = { ".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv", ".webm" };
        private readonly string[] _allowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private readonly long _maxVideoSize = 1000 * 1024 * 1024; 
        private readonly long _maxImageSize = 200  * 1024 * 1024;   

        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> SaveVideoAsync(IFormFile file)
        {
            if (!IsVideoFile(file))
                throw new ArgumentException("صيغة الفيديو غير مدعومة");

            if (!IsValidVideoSize(file))
                throw new ArgumentException($"حجم الفيديو يتجاوز الحد المسموح ({_maxVideoSize / (1024 * 1024)} MB)");

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var folderPath = Path.Combine(_environment.WebRootPath, "videos");
            var filePath = Path.Combine(folderPath, fileName);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/videos/{fileName}";
        }

        public async Task<string> SaveImageAsync(IFormFile file, int maxWidth = 800)
        {
            if (!IsImageFile(file))
                throw new ArgumentException("صيغة الصورة غير مدعومة");

            if (!IsValidImageSize(file))
                throw new ArgumentException($"حجم الصورة يتجاوز الحد المسموح ({_maxImageSize / (1024 * 1024)} MB)");

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var folderPath = Path.Combine(_environment.WebRootPath, "thumbnails");
            var filePath = Path.Combine(folderPath, fileName);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            using var image = await Image.LoadAsync(file.OpenReadStream());

            if (image.Width > maxWidth)
            {
                var ratio = (double)maxWidth / image.Width;
                var newHeight = (int)(image.Height * ratio);
                image.Mutate(x => x.Resize(maxWidth, newHeight));
            }

            await image.SaveAsync(filePath);

            return $"/thumbnails/{fileName}";
        }

        public Task DeleteFileAsync(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
                return Task.CompletedTask;

            var fullPath = Path.Combine(_environment.WebRootPath, filePath.TrimStart('/'));
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }

            return Task.CompletedTask;
        }

        public bool IsVideoFile(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLower();
            return _allowedVideoExtensions.Contains(extension);
        }

        public bool IsImageFile(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLower();
            return _allowedImageExtensions.Contains(extension);
        }

        public bool IsValidVideoSize(IFormFile file)
        {
            return file.Length <= _maxVideoSize;
        }

        public bool IsValidImageSize(IFormFile file)
        {
            return file.Length <= _maxImageSize;
        }
    }
}
