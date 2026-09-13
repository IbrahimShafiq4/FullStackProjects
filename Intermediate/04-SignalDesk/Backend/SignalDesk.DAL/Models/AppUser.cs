using Microsoft.AspNetCore.Identity;
using SignalDesk.DAL.Models.Enums;

namespace SignalDesk.DAL.Models
{
    public class AppUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.Customer;
    }
}
