namespace FitTrackPro.API.Services
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
    }

    public class MediaStorageService : IMediaStorageService
    {
        private readonly IWebHostEnvironment _env;

        private static readonly Dictionary<
            MediaKind,
            (string[] ext, long maxSize, string folder)
        > Rules = new()
        {
            [MediaKind.Image] =
                (
                    new[] { ".jpg", ".jpeg", ".png" },
                    500L * 1024 * 1024,
                    "images"
                ),

            [MediaKind.Video] =
                (
                    new[] { ".mp4", ".webm" },
                    2000L * 1024 * 1024,
                    "video"
                ),

            [MediaKind.Audio] =
                (
                    new[] { ".mp3", ".wav", ".webm" },
                    1000L * 1024 * 1024,
                    "voice"
                )
        };

        public MediaStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveAsync(
            IFormFile file,
            MediaKind kind)
        {
            var (extensions, maxSize, folder) = Rules[kind];

            if (file is null || file.Length == 0)
            {
                throw new InvalidOperationException(
                    "الملف غير موجود أو فارغ"
                );
            }

            var extension =
                Path.GetExtension(file.FileName)
                    .ToLowerInvariant();

            if (!extensions.Contains(extension))
            {
                throw new InvalidOperationException(
                    "نوع الملف غير مدعوم"
                );
            }

            if (file.Length > maxSize)
            {
                var maxSizeInMb =
                    maxSize / (1024 * 1024);

                throw new InvalidOperationException(
                    $"الحجم يتخطى الحجم المسموح به ({maxSizeInMb}MB)."
                );
            }

            var fileName =
                $"{Guid.NewGuid()}{extension}";


            var folderPath =
                Path.Combine(
                    _env.WebRootPath,
                    "uploads",
                    folder
                );

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var fullPath =
                Path.Combine(
                    folderPath,
                    fileName
                );

            await using var fileStream =
                new FileStream(
                    fullPath,
                    FileMode.Create
                );

            await file.CopyToAsync(fileStream);

            return $"/uploads/{folder}/{fileName}";
        }
    }
}