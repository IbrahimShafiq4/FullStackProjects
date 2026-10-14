using MarketPulse.API.Data;
using MarketPulse.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace MarketPulse.API.Services
{
    public interface IBidService
    {
        Task<(bool success, string? error, Bid? bid)> PlaceBidAsync(int auctionId, string bidderId, decimal amount);
    }

    public class BidService : IBidService
    {
        private const decimal MinIncrement = 1m;
        private const int MaxRetries = 3;

        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<BidService> _logger;

        public BidService(AppDbContext context, IMemoryCache cache, ILogger<BidService> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }

        public async Task<(bool success, string? error, Bid? bid)> PlaceBidAsync(int auctionId, string bidderId, decimal amount)
        {
            if (amount <= 0)
                return (false, "المبلغ غير صحيح", null);

            for (int attempt = 0; attempt < MaxRetries; attempt++)
            {
                var auction = await _context.Auctions.FindAsync(auctionId);

                if (auction is null) return (false, "المزاد غير موجود", null);
                if (auction.Status != AuctionStatus.Active) return (false, "المزاد مغلق", null);
                if (DateTime.UtcNow >= auction.EndsAt) return (false, "انتهى وقت المزاد", null);
                if (auction.SellerId == bidderId) return (false, "لا يمكنك المزايدة على مزادك", null);

                if (amount < auction.CurrentHighestBid + MinIncrement)
                    return (false, $"الحد الأدنى للزيادة {MinIncrement:N0} جنيه", null);

                auction.CurrentHighestBid = amount;
                auction.WinnerId = bidderId;

                var bid = new Bid
                {
                    AuctionId = auctionId,
                    BidderId = bidderId,
                    Amount = amount,
                    PlacedAt = DateTime.UtcNow
                };
                _context.Bids.Add(bid);

                try
                {
                    await _context.SaveChangesAsync();
                    _cache.Remove("popular_auctions");

                    var bidder = await _context.Users.FindAsync(bidderId);
                    bid.Bidder = bidder!;

                    return (true, null, bid);
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    _logger.LogWarning(ex, "Concurrency conflict on auction {AuctionId}, attempt {Attempt}",
                        auctionId, attempt + 1);

                    foreach (var entry in ex.Entries)
                        await entry.ReloadAsync();

                    _context.ChangeTracker.Clear();

                    if (attempt == MaxRetries - 1)
                        return (false, "حصلت مزايدة أخرى في نفس اللحظة، حاول مجددًا", null);
                }
            }

            return (false, "تعذر إتمام المزايدة", null);
        }
    }
}