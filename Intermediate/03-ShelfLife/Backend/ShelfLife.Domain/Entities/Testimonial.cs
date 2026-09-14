namespace ShelfLife.Domain.Entities
{
    public class Testimonial
    {
        public int      Id          { get; set; }
        public string   Name        { get; set; } = string.Empty;
        public string   Role        { get; set; } = string.Empty;
        public string   City        { get; set; } = string.Empty;
        public string   Quote       { get; set; } = string.Empty;
        public string   Initials    { get; set; } = string.Empty;
        public int      Rating      { get; set; } = 5;
        public bool     IsApproved  { get; set; } = false;
        public DateTime CreatedAt   { get; set; } = DateTime.UtcNow;

        public string?  AppUserId   { get; set; }
        public AppUser? AppUser     { get; set; } = null!;
    }
}