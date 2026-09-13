namespace RentEase.API.Models
{
    public enum BookingStatus
    {
        Pending = 1,
        Confirmed = 2,
        Cancelled = 3
    }

    public class Booking
    {
        public int              Id          { get; set; }
        public DateTime         StartDate   { get; set; }
        public DateTime         EndDate     { get; set; }
        public BookingStatus    Status      { get; set; } = BookingStatus.Pending;
        public int              EquipmentId { get; set; }
        public Equipment        Equipment   { get; set; } = null!;
        public string           RenterId    { get; set; } = string.Empty;
        public AppUser          User        { get; set; } = null!;
    }
}
