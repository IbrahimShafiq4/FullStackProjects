namespace MarketPulse.API.DTOs
{
    public class RegisterDto 
    { 
        public string FullName  { get; set; } = string.Empty; 
        public string Email     { get; set; } = string.Empty; 
        public string Password  { get; set; } = string.Empty; 
    }

    public class LoginDto
    {
        public string Email     { get; set; } = string.Empty;
        public string Password  { get; set; } = string.Empty;
    }

    public class AuctionDto
    {
        public int      Id                  { get; set; }
        public string   Title               { get; set; } = string.Empty;
        public decimal  StartingPrice       { get; set; }
        public decimal  CurrentHighestBid   { get; set; }
        public DateTime EndsAt              { get; set; }
        public string   Status              { get; set; } = string.Empty;
        public string   SellerName          { get; set; } = string.Empty;
    }

    public class CreateAuctionDto 
    { 
        public string   Title           { get; set; } = string.Empty; 
        public decimal  StartingPrice   { get; set; } 
        public int      DurationMinutes { get; set; } 
    }
    public class PlaceBidDto 
    { 
        public decimal Amount { get; set; } 
    }

}
