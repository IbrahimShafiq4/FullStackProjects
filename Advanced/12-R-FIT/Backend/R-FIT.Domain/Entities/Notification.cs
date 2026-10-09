using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Domain.Entities
{
    public enum NotificationType { NewFollower = 1, NewComment = 2, NewReaction = 3, newShare = 4, NewReply = 5 }
    public class Notification
    {
        public int              Id              { get; set; }
        public NotificationType Type            { get; set; }
        public string           Message         { get; set; } = string.Empty;
        public bool             IsRead          { get; set; } = false;
        public DateTime         CreatedAt       { get; set; } = DateTime.UtcNow;
        public string           RecipientId     { get; set; } = string.Empty;
        public int?             RelatedPostId   { get; set; }
    }
}
