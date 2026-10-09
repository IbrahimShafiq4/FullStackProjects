using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class PostHashtag
    {
        public int      Id          { get; set; }
        public int      PostId      { get; set; }
        public Post     Post        { get; set; } = null!;
        public int      HashtagId   { get; set; }
        public Hashtag  Hashtag     { get; set; } = null!;
    }
}
