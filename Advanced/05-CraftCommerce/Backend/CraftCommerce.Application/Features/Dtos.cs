namespace CraftCommerce.Application.Features
{
    public record RegisterDto(string StoreName, string Email, string Password);
    public record LoginDto(string Email, string Password);
    public record CategoryDto(int Id, string Name);
    public record ProductImageDto(int Id, string Url);
    public record ProductDto(int Id, string Name, string Description, decimal Price, int StockQuantity, string CategoryName, string ArtisanName, double AvgRating, List<ProductImageDto> Images);
    public record CreateProductDto(string Name, string Description, decimal Price, int StockQuantity, int CategoryId);
    public record CartItemDto(int Id, int ProductId, string ProductName, decimal Price, int Quantity, decimal LineTotal);
    public record AddToCartDto(int ProductId, int Quantity);
    public record CreateAddressDto(string City, string Country, string FullAddress, string Zone);
    public record AddressDto(int Id, string City, string Country, string FullAddress, string Zone);
    public record CreateReviewDto(int Rating, string Comment);
    public record ReviewDto(int Id, int Rating, string Comment, DateTime CreatedAt, int ProductId, string ProductName, string BuyerId);
    public record OrderDto(int Id, decimal Subtotal, decimal ShippingCost, decimal Total, string Status, DateTime CreatedAt);
    public record CreateCategoryDto(string Name);
    public record UpdateCategoryDto(string Name);
}