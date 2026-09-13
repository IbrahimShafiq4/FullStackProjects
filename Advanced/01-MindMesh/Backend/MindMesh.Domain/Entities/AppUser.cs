using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Domain.Entities
{
    public class AppUser: IdentityUser
    {
        public string               FullName    { get; set; } = string.Empty;
        public DateTime             CreatedAt   { get; set; } = DateTime.UtcNow;
        public ICollection<Board>   Boards      { get; set; } = new List<Board>();
    }
}
