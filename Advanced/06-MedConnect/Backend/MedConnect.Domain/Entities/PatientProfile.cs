using System;

namespace MedConnect.Domain.Entities
{
    public class PatientProfile
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public string PhotoUrl { get; set; } = string.Empty;
        public string BloodType { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string EmergencyContact { get; set; } = string.Empty;
        public string EmergencyPhone { get; set; } = string.Empty;

        public string ChronicDiseasesJson { get; set; } = "[]";
        public string AllergiesJson { get; set; } = "[]";
        public string CurrentMedicationsJson { get; set; } = "[]";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}