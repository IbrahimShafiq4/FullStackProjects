using Microsoft.AspNetCore.Identity;

namespace FitTrackPro.API.Models
{
    public enum UserRole { Coach = 1, Trainee = 2 }

    public class AppUser: IdentityUser
    {
        public string   FullName    { get; set; } = string.Empty;
        public UserRole Role        { get; set; }
    }
}
