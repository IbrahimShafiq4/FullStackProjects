namespace PropVista.API.Services
{
    public enum MediaKind { Image, Video }
    public interface IMediaStorageService
    {
        Task<string> SaveAsync(IFormFile file, MediaKind kind);
    }

    public class MediaStorageService: IMediaStorageService
    {
        private readonly IWebHostEnvironment _env;

        private static readonly Dictionary<MediaKind, (string[] Extensions, long MaxSize, string Folder)> Rules = new()
        {
            [MediaKind.Image] = (
                new[] { ".jpg", ".jpeg", ".png", ".webp" },
                500L * 1024 * 1024,
                "images"
            ),
            [MediaKind.Video] = (
                new[] { ".mp4", ".webm", ".mov", ".mkv" },
                5L * 1024 * 1024 * 1024,
                "videos"
            )
        };

        public MediaStorageService(IWebHostEnvironment env)
        { _env = env; }

        public async Task<string> SaveAsync(IFormFile file, MediaKind kind)
        {
            var (extensions, maxSize, folder) = Rules[kind];
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!extensions.Contains(extension)) throw new InvalidOperationException("نوع الملف غير مدعوم.");
            if (file.Length > maxSize) throw new InvalidOperationException($"الحجم يتخطى الحد المسموح ({maxSize / (1024 * 1024)}MB).");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var folderPath = Path.Combine(_env.WebRootPath, "uploads", folder);
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fullPath = Path.Combine(folderPath, fileName);
            using var stream = new FileStream(fullPath, FileMode.Create);

            await file.CopyToAsync(stream);
            return $"/uploads/{folder}/{fileName}";
        }
    }
}
