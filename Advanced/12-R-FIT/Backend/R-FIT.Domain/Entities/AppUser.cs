using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class AppUser: IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public List<PlatformProfile> PlatformProfiles { get; set; } = new();
        public UserSettings? Settings { get; set; }
    }
}
