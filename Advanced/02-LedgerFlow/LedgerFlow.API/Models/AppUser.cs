using Microsoft.AspNetCore.Identity;

namespace LedgerFlow.API.Models
{
    public class AppUser: IdentityUser
    {
        public string FullName      { get; set; } = string.Empty;
        public string CompanyName   { get; set; } = string.Empty;
    }
}
