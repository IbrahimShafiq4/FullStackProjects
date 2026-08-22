namespace PulseBoardAPI.DTOs.Entries
{
    public class EntryDto
    {
        public int      Id          { get; set; }
        public int      MoodLevel   { get; set; }
        public int      FocusLevel  { get; set; }
        public string?  Note        { get; set; }
        public DateTime EntryDate   { get; set; }
    }
}
