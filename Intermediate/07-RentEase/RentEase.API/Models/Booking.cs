namespace RentEase.API.Models
{
    public enum BookingStatus
    {
        Pending = 1,
        Confirmed = 2,
        Rejected = 3,
        Cancelled = 4,
        Completed = 5
    }

    public class Booking
    {
        public int              Id              { get; set; }
        public DateTime         StartDate       { get; set; }
        public DateTime         EndDate         { get; set; }
        public BookingStatus    Status          { get; set; } = BookingStatus.Pending;

        public int              EquipmentId     { get; set; }
        public Equipment        Equipment       { get; set; } = null!;

        public string           RenterId        { get; set; } = string.Empty;
        public AppUser          Renter          { get; set; } = null!;

        public DateTime         CreatedAt       { get; set; } = DateTime.UtcNow;
        public DateTime?        ConfirmedAt     { get; set; }
        public DateTime?        CancelledAt     { get; set; }
        public string?          RejectionReason { get; set; }

        public int              Days => (int)Math.Ceiling((EndDate - StartDate).TotalDays);
        public decimal          TotalPrice      { get; set; }
    }
}