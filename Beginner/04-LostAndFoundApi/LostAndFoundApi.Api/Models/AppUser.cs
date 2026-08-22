using Microsoft.AspNetCore.Identity;

namespace LostAndFoundApi.Api.Models
{
    public class AppUser: IdentityUser
    {
        public string DisplayName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<Item> Items { get; set; } = new();
    }
}
