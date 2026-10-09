using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class Post
    {
        public int              Id          { get; set; }
        public string           Content     { get; set; } = string.Empty;
        public DateTime         CreatedAt   { get; set; } = DateTime.UtcNow;

        public string           AuthorId    { get; set; } = string.Empty;
        public AppUser          Author      { get; set; } = null!;

        public List<PostTarget> Targets     { get; set; } = new();
        public List<MediaFile>  MediaFiles  { get; set; } = new();
        public List<Comment>    Comments    { get; set; } = new();
        public List<Reaction>   Reactions   { get; set; } = new();
        public List<Share>      Shares      { get; set; } = new();
    }
}
