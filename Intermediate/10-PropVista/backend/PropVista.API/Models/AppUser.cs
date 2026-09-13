using Microsoft.AspNetCore.Identity;

namespace PropVista.API.Models
{
    public enum UserRole { Owner = 1, Seeker = 2 }
    public class AppUser: IdentityUser
    {
        public string   FullName    { get; set; } = string.Empty;
        public UserRole Role        { get; set; }
    }
}
