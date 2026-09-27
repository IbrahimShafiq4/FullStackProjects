using MedConnect.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace MedConnect.Domain.Entities
{
    public class Appointment
    {
        public int Id { get; set; }
        public DateTime ScheduledAt { get; set; }
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Booked;

        public string PatientComplaint { get; set; } = string.Empty;

        public bool DayBeforeReminderSent { get; set; }
        public bool DayOfReminderSent { get; set; }

        public string DoctorId { get; set; } = string.Empty;
        public Doctor Doctor { get; set; } = null!;
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public Prescription? Prescription { get; set; }
    }
}