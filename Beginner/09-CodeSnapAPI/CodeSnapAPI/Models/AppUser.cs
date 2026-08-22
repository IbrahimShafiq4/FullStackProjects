using Microsoft.AspNetCore.Identity;

namespace CodeSnapAPI.Models
{
    public class AppUser: IdentityUser
    {
        public string FullName { get; set; } = string.Empty;    
    }
}
