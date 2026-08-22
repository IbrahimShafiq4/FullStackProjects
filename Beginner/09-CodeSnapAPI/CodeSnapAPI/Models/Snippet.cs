namespace CodeSnapAPI.Models
{
    public class Snippet
    {
        public int                  Id              { get; set; }
        public string               Title           { get; set; } = string.Empty;
        public string               Code            { get; set; } = string.Empty;
        public ProgrammingLanguage  Language        { get; set; }
        public string?              ScreenshotUrl   { get; set; }

        public DateTime             CreatedAt       { get; set; } = DateTime.UtcNow;

        public string               AppUserId       { get; set; } = string.Empty;
        public AppUser              AppUser         { get; set; } = null!;
    }
}
