namespace PulseBoardAPI.DTOs.Entries
{
    public class CreateEntryDto
    {
        public int      MoodLevel   { get; set; }
        public int      FocusLevel  { get; set; }
        public string?  Note        { get; set; }
    }
}
