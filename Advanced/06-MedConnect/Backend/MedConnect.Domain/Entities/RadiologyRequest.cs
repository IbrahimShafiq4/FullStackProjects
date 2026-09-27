using System;

namespace MedConnect.Domain.Entities
{
    public enum RadiologyRequestStatus
    {
        Pending = 1,
        Fulfilled = 2,
        Cancelled = 3
    }

    public class RadiologyRequest
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; } = null!;

        public string ScanType { get; set; } = string.Empty;
        public string BodyPart { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;

        public RadiologyRequestStatus Status { get; set; } = RadiologyRequestStatus.Pending;

        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? FulfilledAt { get; set; }
    }
}