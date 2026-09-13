namespace MarketPulse.API.Models
{
    public class Bid
    {
        public int      Id          { get; set; }
        public decimal  Amount      { get; set; }
        public DateTime PlacedAt    { get; set; } = DateTime.UtcNow;
        public int      AuctionId   { get; set; }
        public Auction  Auction     { get; set; } = null!;
        public string   BidderId    { get; set; } = string.Empty;
        public AppUser  Bidder      { get; set; } = null!;
    }
}
