using Microsoft.AspNetCore.Identity;

namespace NoteVaultAPI.Models
{
    public class AppUser: IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
