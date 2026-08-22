using LostAndFoundApi.Api.Models;

namespace LostAndFoundApi.Api.Services
{
    public interface IMatchingService
    {
        Task<List<Item>> FindPotentialMatchesAsync(Item item);
    }
}
