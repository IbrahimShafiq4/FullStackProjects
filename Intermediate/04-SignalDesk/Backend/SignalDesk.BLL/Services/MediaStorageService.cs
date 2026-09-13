using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace SignalDesk.BLL.Services
{
    public enum MediaKind { Image, Video, Voice }

    public interface IMediaStorageService
    {
        Task<string> SaveAsync(IFormFile file, MediaKind kind);
    }

    public class MediaStorageService : IMediaStorageService
    {
        private readonly IWebHostEnvironment _env;

        private static readonly Dictionary<MediaKind, (string[] ext, long maxSize, string folder)> Rules = new()
        {
            [MediaKind.Image] = (new[] { ".jpg", ".jpeg", ".png" }, 5 * 1024 * 1024, "images"),
            [MediaKind.Video] = (new[] { ".mp4", ".webm" }, 50 * 1024 * 1024, "videos"),
            [MediaKind.Voice] = (new[] { ".mp3", ".wav", ".webm" }, 10 * 1024 * 1024, "voice"),
        };

        public MediaStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveAsync(IFormFile file, MediaKind kind)
        {
            var (extensions, maxSize, folder) = Rules[kind];
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!extensions.Contains(extension))
                throw new InvalidOperationException("نوع الملف غير مدعوم لهذا النوع من المرفقات.");

            if (file.Length > maxSize)
                throw new InvalidOperationException($"حجم الملف يتخطى الحد المسموح ({maxSize / (1024 * 1024)}MB).");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var folderPath = Path.Combine(_env.WebRootPath, "uploads", folder);
            Directory.CreateDirectory(folderPath);

            var fullPath = Path.Combine(folderPath, fileName);
            using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/uploads/{folder}/{fileName}";
        }
    }
}
