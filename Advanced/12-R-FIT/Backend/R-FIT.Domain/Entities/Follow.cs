using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class Follow
    {
        public int Id { get; set; }
        public string   FollowerId  { get; set; } = string.Empty;
        public string   FollowingId { get; set; } = string.Empty;
        public DateTime FollowedAt  { get; set; } = DateTime.UtcNow;
    }
}
