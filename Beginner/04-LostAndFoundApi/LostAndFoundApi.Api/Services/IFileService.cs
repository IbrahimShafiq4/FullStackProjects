namespace LostAndFoundApi.Api.Services
{
    public interface IFileService
    {
        Task<string> SaveImageAsync(IFormFile file, string folder);
    }
}
