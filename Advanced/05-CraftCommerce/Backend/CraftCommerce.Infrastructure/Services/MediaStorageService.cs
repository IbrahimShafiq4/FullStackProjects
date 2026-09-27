using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;

namespace CraftCommerce.Infrastructure.Services
{
    public enum MediaKind { Image }
    public interface IMediaStorageService { Task<string> SaveAsync(IFormFile file, MediaKind kind); }

    public class MediaStorageService: IMediaStorageService
    {
        private readonly IWebHostEnvironment _env;
        public MediaStorageService(IWebHostEnvironment env)
        { _env = env; }

        public async Task<string> SaveAsync(IFormFile file, MediaKind kind)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!new[] { ".jpg", ".jpeg", ".png" }.Contains(extension))
                throw new InvalidOperationException("نوع الملف غير مدعوم");

            if (file.Length > 5 * 1024 * 1024)
                throw new InvalidOperationException("حجم الملف يتخطى 5MB");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var folderName = Path.Combine(_env.WebRootPath, "uploads", "products");
            if (!Directory.Exists(folderName))
                Directory.CreateDirectory(folderName);
            using var stream = new FileStream(Path.Combine(folderName, fileName), FileMode.Create);
            await file.CopyToAsync(stream);
            return $"uploads/products/{fileName}";
        }
    }
}
