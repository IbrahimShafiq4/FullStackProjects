using GigLink.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace GigLink.Domain.Entities
{
    public class AppUser: IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public UserRole Role { get; set; }
    }
}
