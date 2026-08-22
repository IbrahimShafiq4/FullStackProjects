namespace PulseBoardAPI.Models
{
    public class PulseEntry
    {
        public int      Id          { get; set; }

        public int      MoodLevel   { get; set; }

        public int      FocusLevel  { get; set; }

        public string?  Note        { get; set; }
        public DateTime EntryDate   { get; set; } = DateTime.UtcNow.Date;

        public string   AppUserId   { get; set; } = string.Empty;
        public AppUser  AppUser     { get; set; } = null!;
    }
}
