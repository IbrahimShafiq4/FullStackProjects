using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class Bookmark
    {
        public int      Id      { get; set; }
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;
        public int      PostId  { get; set; }
        public Post     Post    { get; set; } = null!;
        public string   UserId  { get; set; } = string.Empty;
    }
}
