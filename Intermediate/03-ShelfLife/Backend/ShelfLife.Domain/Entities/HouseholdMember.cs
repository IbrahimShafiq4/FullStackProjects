using System;
using System.Collections.Generic;
using System.Text;

namespace ShelfLife.Domain.Entities
{
    public class HouseholdMember
    {
        public int      Id              { get; set; }
        public string   OwnerUserId     { get; set; } = string.Empty;
        public string   MemberUserId    { get; set; } = string.Empty;
        public AppUser  Owner           { get; set; } = null!;
        public AppUser  Member          { get; set; } = null!;
        public DateTime JoinedAt        { get; set; } = DateTime.UtcNow;
    }
}
