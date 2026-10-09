using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class Hashtag
    {
        public int                  Id      { get; set; }
        public string               Name    { get; set; } = string.Empty;
        public List<PostHashtag>    Posts   { get; set; } = new();
    }
}
