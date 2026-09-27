using System.Collections.Generic;

namespace StreamVault.Domain.Domain
{
    public class Course
    {
        public int          Id              { get; set; }
        public string       Title           { get; set; } = string.Empty;
        public string       Description     { get; set; } = string.Empty;
        public string       InstructorId    { get; set; } = string.Empty;
        public Instructor   Instructor      { get; set; } = null!;
        public List<Video>  Videos          { get; set; } = null!;

        public int?         FloorId         { get; set; }
        public Floor?       Floor           { get; set; }

        public int          ClassroomNumber { get; set; } = 1;

        public string       Status          { get; set; } = "study";
    }
}