using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace ShelfLife.Infrastructure.Services
{
    public enum MediaKind
    {
        Image,
        Video,
        Audio
    }

    public interface IMediaStorageService
    {
        Task<string> SaveAsync(IFormFile file, MediaKind kind);
        Task<string?> CreateThumbnailAsync(IFormFile file);
        void Delete(string? relativeUrl);
    }

    public class MediaStorageService : IMediaStorageService
    {
        private readonly IWebHostEnvironment _env;

        private static readonly Dictionary<MediaKind, (string[] extensions, long maxSize, string folder)> Rules = new()
        {
            [MediaKind.Image] = (new[] { ".jpg", ".jpeg", ".png" }, 200 * 1024 * 1024, "images"),
            [MediaKind.Video] = (new[] { ".mp4", ".webm" }, 2000 * 1024 * 1024, "videos"),
            [MediaKind.Audio] = (new[] { ".mp3", ".wav", ".webm", ".ogg" }, 100 * 1024 * 1024, "voice-notes")
        };

        public MediaStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveAsync(IFormFile file, MediaKind kind)
        {
            var (extensions, maxSize, folder) = Rules[kind];

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!extensions.Contains(extension))
            {
                throw new InvalidOperationException($"نوع الملف غير مدعوم لهذا النوع من الميديا ({string.Join(", ", extensions)}).");
            }

            if (file.Length > maxSize)
            {
                throw new InvalidOperationException($"حجم الملف يتخطى الحد الأقصى المسموح ({maxSize / (1024 * 1024)}MB).");
            }

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";

            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", folder);

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{folder}/{uniqueFileName}";
        }

        public async Task<string?> CreateThumbnailAsync(IFormFile file)
        {
            try
            {
                using var stream = file.OpenReadStream();

                using SixLabors.ImageSharp.Image image = await SixLabors.ImageSharp.Image.LoadAsync(stream);

                const int maxWidth = 400;

                if (image.Width > maxWidth)
                {
                    image.Mutate(x => x.Resize(maxWidth, 0));
                }

                var thumbsFolder = Path.Combine(_env.WebRootPath, "uploads", "thumbnails");

                if (!Directory.Exists(thumbsFolder))
                {
                    Directory.CreateDirectory(thumbsFolder);
                }

                var thumbFileName = $"thumb_{Guid.NewGuid()}.jpg";
                var thumbPath = Path.Combine(thumbsFolder, thumbFileName);

                await image.SaveAsJpegAsync(thumbPath);

                return $"/uploads/thumbnails/{thumbFileName}";
            }
            catch
            {
                return null;
            }
        }

        public void Delete(string? relativeUrl)
        {
            if (string.IsNullOrWhiteSpace(relativeUrl))
                return;

            var fullPath = Path.Combine(_env.WebRootPath, relativeUrl.TrimStart('/'));

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        }
    }
}