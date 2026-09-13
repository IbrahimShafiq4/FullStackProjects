using System.ComponentModel.DataAnnotations;

namespace MarketPulse.API.Models
{
    public enum AuctionStatus { Active = 1, Closed = 2 }
    public class Auction
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal StartingPrice { get; set; }
        public decimal CurrentHighestBid { get; set; }
        public DateTime EndsAt { get; set; }
        public AuctionStatus Status { get; set; } = AuctionStatus.Active;

        public string SellerId { get; set; } = string.Empty;
        public AppUser Seller { get; set; } = null!;
        public string? WinnerId { get; set; }
        public AppUser? Winner { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; } = null!;
        public List<Bid> Bids { get; set; } = new();

        public List<string> MediaUrls { get; set; } = new();
    }
}