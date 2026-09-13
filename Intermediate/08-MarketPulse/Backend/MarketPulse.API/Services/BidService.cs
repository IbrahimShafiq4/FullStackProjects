using MarketPulse.API.Data;
using MarketPulse.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MarketPulse.API.Services
{
    public interface IBidService
    {
        Task<(bool success, string? error, Bid? bid)> PlaceBidAsync(int auctionId, string bidderId, decimal amount);
    }

    public class BidService : IBidService
    {
        private readonly AppDbContext _context;
        public BidService(AppDbContext context) => _context = context;

        public async Task<(bool success, string? error, Bid? bid)> PlaceBidAsync(int auctionId, string bidderId, decimal amount)
        {
            var auction = await _context.Auctions.FindAsync(auctionId);
            if (auction is null) return (false, "المزاد غير موجود", null);
            if (auction.Status != AuctionStatus.Active) return (false, "المزاد مغلق", null);
            if (amount <= auction.CurrentHighestBid) return (false, "يجب أن تكون المزايدة أعلى من الحالية", null);

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
                var bidder = await _context.Users.FindAsync(bidderId);
                bid.Bidder = bidder!;
                return (true, null, bid);
            }
            catch (DbUpdateConcurrencyException)
            {
                return (false, "حصلت مزايدة أخرى في نفس اللحظة، حاول مجدداً", null);
            }
        }
    }
}