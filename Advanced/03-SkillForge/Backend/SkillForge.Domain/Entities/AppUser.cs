using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace SkillForge.Domain.Entities
{
    public class AppUser: IdentityUser
    {
        public string FullName  { get; set; } = string.Empty;
        public string Role      { get; set; } = "Candidate";
    }
}
