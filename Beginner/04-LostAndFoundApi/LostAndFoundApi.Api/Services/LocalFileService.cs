namespace LostAndFoundApi.Api.Services
{
    public class LocalFileService : IFileService
    {
        private readonly IWebHostEnvironment _env;
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private const long MaxFileSize = 5 * 1024 * 1024;

        public LocalFileService(IWebHostEnvironment env)
        { _env = env; }

        public async Task<string> SaveImageAsync(IFormFile file, string folder)
        {
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!AllowedExtensions.Contains(extension))
                throw new InvalidOperationException("نوع الملف غير مسموح");

            if (file.Length > MaxFileSize)
                throw new InvalidOperationException("حجم الملف أكبر من 5 ميجا");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var folderPath = Path.Combine(_env.WebRootPath, folder);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/{folder}/{fileName}";
        }
    }
}
