using System;

namespace StreamVault.Domain.Domain
{
    public enum ReviewTargetType { Teacher = 1, Course = 2, StudyFile = 3 }

    public class Review
    {
        public int Id { get; set; }
        public string AuthorId { get; set; } = string.Empty;
        public Instructor Author { get; set; } = null!;
        public ReviewTargetType TargetType { get; set; }
        public int TargetId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}