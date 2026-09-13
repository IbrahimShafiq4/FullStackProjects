namespace PropVista.API.Models
{
    public enum ViewingStatus
    {
        Scheduled = 1,
        Completed = 2,
        Cancelled = 3
    }

    public class Viewing
    {
        public int              Id          { get; set; }
        public DateTime         ScheduledAt { get; set; }
        public ViewingStatus    Status      { get; set; } = ViewingStatus.Scheduled;

        public int              PropertyId   { get; set; }
        public Property         Property    { get; set; } = null!;

        public string           SeekerId    { get; set; } = string.Empty;
        public AppUser          Seeker      { get; set; } = null!;

    }
}
