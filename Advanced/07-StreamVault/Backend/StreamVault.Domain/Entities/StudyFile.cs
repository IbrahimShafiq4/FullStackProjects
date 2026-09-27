using StreamVault.Domain.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace StreamVault.Domain.Entities
{
    public class StudyFile
    {
        public int          Id                  { get; set; }
        public string       Title               { get; set; } = string.Empty;
        public string       Description         { get; set; } = string.Empty;
        public string       FilePath            { get; set; } = string.Empty;
        public string       OriginalFileName    { get; set; } = string.Empty;
        public string       ContentType         { get; set; } = string.Empty;
        public long         FileSizeBytes       { get; set; }
        public int          CourseId            { get; set; }
        public Course       Course              { get; set; } = null!;
        public string       TeacherId           { get; set; } = string.Empty;
        public Instructor   Teacher             { get; set; } = null!;
        public decimal      Price               { get; set; }
        public bool         IsFree              { get; set; }
        public DateTime     CreatedAt           { get; set; } = DateTime.UtcNow;
    }
}
