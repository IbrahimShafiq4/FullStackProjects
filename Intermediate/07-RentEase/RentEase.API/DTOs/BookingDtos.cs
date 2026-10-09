namespace RentEase.API.DTOs
{
    public class BookingDto
    {
        public int          Id                  { get; set; }
        public DateTime     StartDate           { get; set; }
        public DateTime     EndDate             { get; set; }
        public int          Days                { get; set; }
        public decimal      TotalPrice          { get; set; }
        public string       Status              { get; set; } = string.Empty;

        public int          EquipmentId         { get; set; }
        public string       EquipmentName       { get; set; } = string.Empty;
        public string       EquipmentCategory   { get; set; } = string.Empty;
        public string?      EquipmentImageUrl   { get; set; }

        public string       RenterId            { get; set; } = string.Empty;
        public string       RenterName          { get; set; } = string.Empty;
        public string       OwnerId             { get; set; } = string.Empty;
        public string       OwnerName           { get; set; } = string.Empty;

        public DateTime     CreatedAt           { get; set; }
        public DateTime?    ConfirmedAt         { get; set; }
        public DateTime?    CancelledAt         { get; set; }
        public string?      RejectionReason     { get; set; }
    }

    public class RejectBookingDto
    {
        public string?      Reason              { get; set; }
    }
}