using EventSphere.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Domain.Entities
{
    public class Booking
    {
        public int              Id          { get; set; }
        public decimal          FinalPrice  { get; set; }
        public DateTime         BookedAt    { get; set; } = DateTime.UtcNow;
        public BookingStatus    Status      { get; set; } = BookingStatus.Pending;

        public int              SeatId      { get; set; }
        public Seat             Seat        { get; set; } = null!;

        public string           AttendeeId  { get; set; } = string.Empty;
        public AppUser          Attendee    { get; set; } = null!;
    }
}
