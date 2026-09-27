using System.Collections.Generic;

namespace StreamVault.Domain.Domain
{
    public class Floor
    {
        public int          Id          { get; set; }
        public int          Number      { get; set; }
        public string       Name        { get; set; } = string.Empty;
        public string       Description { get; set; } = string.Empty;
        public List<Course> Classrooms  { get; set; } = new();
    }
}