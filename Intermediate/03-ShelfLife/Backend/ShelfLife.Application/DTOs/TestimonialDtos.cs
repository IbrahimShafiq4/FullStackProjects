namespace ShelfLife.Application.DTOs
{
    public class TestimonialDto
    {
        public int      Id          { get; set; }
        public string   Name        { get; set; } = string.Empty;
        public string   Role        { get; set; } = string.Empty;
        public string   City        { get; set; } = string.Empty;
        public string   Quote       { get; set; } = string.Empty;
        public string   Initials    { get; set; } = string.Empty;
        public int      Rating      { get; set; }
        public bool     IsApproved  { get; set; }
        public DateTime CreatedAt   { get; set; }
    }

    public class CreateTestimonialDto
    {
        public string   Name    { get; set; } = string.Empty;
        public string   Role    { get; set; } = string.Empty;
        public string   City    { get; set; } = string.Empty;
        public string   Quote   { get; set; } = string.Empty;
        public int      Rating  { get; set; } = 5;
    }
}