namespace LostAndFoundApi.Api.Services
{
    public class LocalFileService : IFileService
    {
        private readonly IWebHostEnvironment _env;

        private static readonly string[] AllowedExtensions =
        {
            ".jpg", ".jpeg", ".png", ".webp"
        };

        private const long MaxFileSize = 5 * 1024 * 1024;

        public LocalFileService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveImageAsync(IFormFile file, string folder)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!AllowedExtensions.Contains(extension))
                throw new InvalidOperationException("نوع الملف غير مسموح");

            if (file.Length > MaxFileSize)
                throw new InvalidOperationException("حجم الملف أكبر من 5 ميجا");

            var webRootPath = _env.WebRootPath
                ?? Path.Combine(_env.ContentRootPath, "wwwroot");

            if (!Directory.Exists(webRootPath))
                Directory.CreateDirectory(webRootPath);

            var folderPath = Path.Combine(webRootPath, folder);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(folderPath, fileName);

            await using var stream = new FileStream(filePath, FileMode.Create);

            await file.CopyToAsync(stream);

            return $"/{folder}/{fileName}";
        }
    }
}