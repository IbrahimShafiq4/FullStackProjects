using Microsoft.AspNetCore.Identity;

namespace PulseBoardAPI.Models
{
    public class AppUser: IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
