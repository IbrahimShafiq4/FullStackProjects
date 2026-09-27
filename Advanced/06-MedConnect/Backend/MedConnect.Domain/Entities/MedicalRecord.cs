using System;
using System.Collections.Generic;

namespace MedConnect.Domain.Entities
{
    public class MedicalRecord
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; } = null!;

        public string ChiefComplaint { get; set; } = string.Empty;
        public string Diagnosis { get; set; } = string.Empty;
        public string ExaminationNotes { get; set; } = string.Empty;
        public string TreatmentPlan { get; set; } = string.Empty;
        public string FollowUpNotes { get; set; } = string.Empty;

        public string VitalsJson { get; set; } = "{}";

        public List<TreatmentStage> Stages { get; set; } = new();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}