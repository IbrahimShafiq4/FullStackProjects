using Microsoft.AspNetCore.Identity;

namespace VibeVaultAPI.Models
{
    public class AppUser: IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
