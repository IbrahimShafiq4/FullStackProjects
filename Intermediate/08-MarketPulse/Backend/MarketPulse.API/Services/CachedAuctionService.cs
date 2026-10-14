using MarketPulse.API.Data;
using MarketPulse.API.DTOs;
using MarketPulse.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace MarketPulse.API.Services
{
    public interface ICachedAuctionService
    {
        Task<List<AuctionDto>> GetPopularAuctionsAsync();
    }

    public class CachedAuctionService : ICachedAuctionService
    {
        private const string CacheKey = "popular_auctions";
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;

        public CachedAuctionService(AppDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public async Task<List<AuctionDto>> GetPopularAuctionsAsync()
        {
            return await _cache.GetOrCreateAsync(CacheKey, async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30);

                return await _context.Auctions
                    .Where(a => a.Status == AuctionStatus.Active)
                    .OrderByDescending(a => a.Bids.Count)
                    .Take(10)
                    .Select(a => new AuctionDto
                    {
                        Id = a.Id,
                        Title = a.Title,
                        StartingPrice = a.StartingPrice,
                        CurrentHighestBid = a.CurrentHighestBid,
                        EndsAt = a.EndsAt,
                        Status = a.Status.ToString(),
                        SellerName = a.Seller.FullName,
                        CoverUrl = a.MediaUrls.FirstOrDefault(),
                        BidCount = a.Bids.Count
                    })
                    .ToListAsync();
            }) ?? new List<AuctionDto>();
        }
    }
}