using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public class Comment
    {
        public int              Id              { get; set; }
        public string           Content         { get; set; } = string.Empty;
        public DateTime         CreatedAt       { get; set; } = DateTime.UtcNow;
                                
        public int              PostId          { get; set; }
        public Post             Post            { get; set; } = null!;
                                
        public string           AuthorId        { get; set; } = string.Empty;
        public AppUser          Author          { get; set; } = null!;
                                
        public int?             ParentCommentId { get; set; }
        public Comment?         ParentComment   { get; set; }
        public List<Comment>    Replies         { get; set; } = new();
    }
}
