using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace SoundVaultAPI.Models
{
    public class AppUser: IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
