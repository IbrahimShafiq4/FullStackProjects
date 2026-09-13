using Microsoft.AspNetCore.Identity;

namespace RentEase.API.Models
{
    public class AppUser: IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
