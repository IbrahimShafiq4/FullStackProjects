using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class Story
    {
        public int              Id          { get; set; }
        public string           MediaUrl    { get; set; } = string.Empty;
        public DateTime         CreatedAt   { get; set; } = DateTime.UtcNow;
        public DateTime         ExpiredAt   { get; set; } = DateTime.UtcNow.AddHours(24);
        public string           AuthorId    { get; set; } = string.Empty;
        public AppUser          Author      { get; set; } = null!;
        public List<StoryView>  Views       { get; set; } = new();
    }
}
