namespace CodeSnapAPI.Services
{
    public interface IFileStorageService
    {
        Task<(string url, string type)> SaveMediaAsync(IFormFile file);
        void DeleteFile(string? relativeUrl);
    }

    public class FileStorageService: IFileStorageService
    {
        private readonly IWebHostEnvironment _env;

        private readonly string[]   _imageExtensions    = { ".jpg", ".jpeg", ".png" };
        private const long          MaxImageSize        = 200 * 1024 * 1024;

        public FileStorageService(IWebHostEnvironment env) { _env = env; }

        public async Task<(string url, string type)> SaveMediaAsync(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName);

            if (!_imageExtensions.Contains(extension))
            {
                throw new InvalidOperationException("نوع الملف غير مدعوم المسموح. jpg, jpeg, png");
            }

            if (file.Length > MaxImageSize)
            {
                throw new InvalidOperationException($"حجم الملف يتخطى الحد الأقصى المسموح به {MaxImageSize}MB");
            }

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";

            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "screenshots");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return ($"uploads/screenshots/{uniqueFileName}", "Image");
        }

        public void DeleteFile(string? relativeUrl)
        {
            if (string.IsNullOrWhiteSpace(relativeUrl)) return;

            var fullPath = Path.Combine(_env.WebRootPath, relativeUrl.TrimStart('/'));

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        }
    }
}
