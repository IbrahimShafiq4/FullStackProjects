using Microsoft.AspNetCore.Identity;

namespace ShelfLife.Domain.Entities
{
    public class AppUser : IdentityUser
    {
        public string   FullName    { get; set; } = string.Empty;
        public bool     IsAdmin     { get; set; } = false;
    }
}