using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace StreamVault.Domain.Domain
{
    public class Instructor: IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
