using System.ComponentModel.DataAnnotations;

namespace MarketPulse.API.DTOs
{
    public class RegisterDto
    {
        [Required, StringLength(80, MinimumLength = 3)]
        public string FullName { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(120)]
        public string Email { get; set; } = string.Empty;

        [Required, StringLength(100, MinimumLength = 8)]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class AuctionDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal StartingPrice { get; set; }
        public decimal CurrentHighestBid { get; set; }
        public DateTime EndsAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public string SellerName { get; set; } = string.Empty;
        public string? CoverUrl { get; set; }
        public int BidCount { get; set; }
    }

    public class AuctionDetailDto : AuctionDto
    {
        public string SellerId { get; set; } = string.Empty;
        public string? WinnerId { get; set; }
        public string? WinnerName { get; set; }
        public List<string> MediaUrls { get; set; } = new();
    }

    public class CreateAuctionDto
    {
        [Required, StringLength(150, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;

        [Range(1, 10000000)]
        public decimal StartingPrice { get; set; }

        [Range(1, 10080)]
        public int DurationMinutes { get; set; }
    }

    public class PlaceBidDto
    {
        [Range(0.01, 100000000)]
        public decimal Amount { get; set; }
    }

    public class BidDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime PlacedAt { get; set; }
        public string BidderId { get; set; } = string.Empty;
        public string BidderName { get; set; } = string.Empty;
        public string? BidderAvatarUrl { get; set; }
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int Total { get; set; }
        public int TotalPages => (int)Math.Ceiling(Total / (double)PageSize);
    }
}