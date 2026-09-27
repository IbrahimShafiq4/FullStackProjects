using Microsoft.AspNetCore.Identity;

namespace EventSphere.Domain.Entities
{
    public class AppUser : IdentityUser
    {
        public string   FullName    { get; set; } = string.Empty;
        public DateTime CreatedAt   { get; set; } = DateTime.UtcNow;
        public bool     IsActive    { get; set; } = true;
    }
}