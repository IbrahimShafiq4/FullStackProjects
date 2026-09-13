namespace RentEase.API.Services
{
    public interface IMediaStorageService { Task<string> SaveAsync(IFormFile file); }
    public class MediaStorageService: IMediaStorageService
    {
        private readonly IWebHostEnvironment _env;
        public MediaStorageService(IWebHostEnvironment env) { _env = env; }

        public async Task<string> SaveAsync(IFormFile file)
        {
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!new[] { ".jpg", ".jpeg", ".png" }.Contains(ext)) throw new InvalidOperationException("نوع الملف غير مدعوم");

            if (file.Length > 200 * 1024 * 1024) throw new InvalidOperationException("الحجم يتخطى 200MB");

            var fileName = $"{Guid.NewGuid()}{ext}";
            var folder = Path.Combine(_env.WebRootPath, "uploads", "equipment");
            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            using var stream = new FileStream(Path.Combine(folder, fileName), FileMode.Create);
            await file.CopyToAsync(stream);
            return $"/uploads/equipment/{fileName}";

        }
    }
}
