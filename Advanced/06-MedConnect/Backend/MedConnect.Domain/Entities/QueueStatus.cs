using System;

namespace MedConnect.Domain.Entities
{
    public enum QueueStatus
    {
        Waiting = 1,
        Called = 2,
        InProgress = 3,
        Completed = 4,
        Skipped = 5,
        Cancelled = 6
    }

    public class QueueTicket
    {
        public int Id { get; set; }
        public string DoctorId { get; set; } = string.Empty;
        public Doctor Doctor { get; set; } = null!;
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;
        public int? AppointmentId { get; set; }
        public Appointment? Appointment { get; set; }

        public int TicketNumber { get; set; }
        public QueueStatus Status { get; set; } = QueueStatus.Waiting;

        public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CalledAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}