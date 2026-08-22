using Microsoft.AspNetCore.Identity;

namespace MomentoAPI.Models
{
    public class AppUser: IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
