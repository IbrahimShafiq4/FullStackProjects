using System;

namespace MedConnect.Domain.Entities
{
    public class Review
    {
        public int Id { get; set; }

        public string DoctorId { get; set; } = string.Empty;
        public Doctor Doctor { get; set; } = null!;

        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public int? AppointmentId { get; set; }

        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;

        public bool IsVisible { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}