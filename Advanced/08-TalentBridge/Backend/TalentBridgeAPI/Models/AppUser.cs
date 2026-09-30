using Microsoft.AspNetCore.Identity;

namespace TalentBridgeAPI.Models
{
    public enum UserRole { Employer = 1, Candidate = 2 }
    public class AppUser: IdentityUser
    {
        public string   FullName    { get; set; } = string.Empty;
        public UserRole Role        { get; set; }
    }
}
