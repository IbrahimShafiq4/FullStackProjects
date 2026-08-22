using SoundVaultAPI.Models;

namespace SoundVaultAPI.Services
{
    public interface IFileStorageService
    {
        Task<(string url, MediaType type)> SaveMediaAsync(IFormFile file);

        void DeleteFile(string? relativeUrl);
    }

    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _env;

        private readonly string[] _imageExtensions =
            { ".jpg", ".jpeg", ".png", ".webp" };

        private readonly string[] _audioExtensions =
            { ".mp3", ".wav", ".ogg", ".m4a" };

        private readonly string[] _videoExtensions =
            { ".mp4", ".webm" };

        private const long MaxImageSize = 500 * 1024 * 1024;
        private const long MaxVideoSize = 1000 * 1024 * 1024;
        private const long MaxAudioSize = 1000 * 1024 * 1024;

        public FileStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<(string url, MediaType type)> SaveMediaAsync(
            IFormFile file)
        {
            var extension =
                Path.GetExtension(file.FileName)
                    .ToLowerInvariant();

            MediaType mediaType;
            string subFolder;
            long maxSize;

            if (_imageExtensions.Contains(extension))
            {
                mediaType = MediaType.Image;
                subFolder = "images";
                maxSize = MaxImageSize;
            }
            else if (_audioExtensions.Contains(extension))
            {
                mediaType = MediaType.Audio;
                subFolder = "audios";
                maxSize = MaxAudioSize;
            }
            else if (_videoExtensions.Contains(extension))
            {
                mediaType = MediaType.Video;
                subFolder = "videos";
                maxSize = MaxVideoSize;
            }
            else
            {
                throw new InvalidOperationException(
                    "نوع الملف غير مدعوم. المسموح: jpg, jpeg, png, mp3, wav, ogg, m4a, mp4, webm"
                );
            }

            if (file.Length > maxSize)
            {
                var maxMb = maxSize / (1024 * 1024);

                throw new InvalidOperationException(
                    $"حجم الملف يتخطى الحد الأقصى المسموح ({maxMb}MB)"
                );
            }

            var webRootPath = _env.WebRootPath;

            if (string.IsNullOrWhiteSpace(webRootPath))
            {
                webRootPath = Path.Combine(
                    _env.ContentRootPath,
                    "wwwroot"
                );
            }

            var uploadsFolder = Path.Combine(
                webRootPath,
                "uploads",
                subFolder
            );

            Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName =
                $"{Guid.NewGuid()}{extension}";

            var filePath = Path.Combine(
                uploadsFolder,
                uniqueFileName
            );

            await using var stream =
                new FileStream(
                    filePath,
                    FileMode.Create
                );

            await file.CopyToAsync(stream);

            var url =
                $"/uploads/{subFolder}/{uniqueFileName}";

            return (url, mediaType);
        }

        public void DeleteFile(string? relativeUrl)
        {
            if (string.IsNullOrWhiteSpace(relativeUrl))
                return;

            var webRootPath = _env.WebRootPath;

            if (string.IsNullOrWhiteSpace(webRootPath))
            {
                webRootPath = Path.Combine(
                    _env.ContentRootPath,
                    "wwwroot"
                );
            }

            var cleanPath = relativeUrl
                .TrimStart('/')
                .Replace(
                    '/',
                    Path.DirectorySeparatorChar
                );

            var filePath = Path.Combine(
                webRootPath,
                cleanPath
            );

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}