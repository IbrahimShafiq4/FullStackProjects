using System;
using System.Collections.Generic;
using System.Text;

namespace StreamVault.Domain.Domain
{
    public class Video
    {
        public int      Id          { get; set; }
        public string   Title       { get; set; } = string.Empty;
        public string   FilePath    { get; set; } = string.Empty;
        public int      Order       { get; set; }
        public int      CourseId    { get; set; }
        public Course   Course      { get; set; } = null!;

    }
}
