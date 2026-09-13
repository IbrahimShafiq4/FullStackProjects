using MarketPulse.API.Data;
using MarketPulse.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace MarketPulse.API.Services
{
    public interface ICachedAuctionService { Task<List<object>> GetPopularAuctionsAsync(); }
    public class CachedAuctionService: ICachedAuctionService
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private const string CacheKey = "popular_auctions";
        public CachedAuctionService(AppDbContext context, IMemoryCache cache)
        { _context = context; _cache = cache; }

        public async Task<List<object>> GetPopularAuctionsAsync()
        {
            return await _cache.GetOrCreateAsync(CacheKey, async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30);
                var auctions = await _context.Auctions
                                            .Where(a => a.Status == AuctionStatus.Active)
                                            .OrderByDescending(a => a.Bids.Count).Take(10)
                                            .Select(a => new { a.Id, a.Title, a.CurrentHighestBid }).ToListAsync();

                return auctions.Cast<object>().ToList();

            }) ?? new List<Object>();
        }
    }
}
