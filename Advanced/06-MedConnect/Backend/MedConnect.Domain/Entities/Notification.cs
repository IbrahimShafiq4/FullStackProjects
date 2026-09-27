using System;

namespace MedConnect.Domain.Entities
{
    public enum NotificationType
    {
        QueueCalled = 1,
        QueueNext = 2,
        AppointmentSoon = 3,
        AppointmentNew = 4,
        RadiologyReady = 5,
        InvoiceIssued = 6,
        PaymentSuccess = 7,
        PaymentFailed = 8,
        TreatmentStage = 9,
        SystemMessage = 10
    }

    public class Notification
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;

        public NotificationType Type { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;

        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReadAt { get; set; }
    }
}