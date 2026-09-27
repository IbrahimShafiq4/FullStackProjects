using System;
using System.Collections.Generic;

namespace MedConnect.Domain.Entities
{
    public class DoctorProfile
    {
        public int Id { get; set; }
        public string DoctorId { get; set; } = string.Empty;
        public Doctor Doctor { get; set; } = null!;

        public string PhotoUrl { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public int YearsOfExperience { get; set; }

        public string ClinicName { get; set; } = string.Empty;
        public string ClinicAddress { get; set; } = string.Empty;
        public string ClinicPhone { get; set; } = string.Empty;
        public string ClinicHours { get; set; } = string.Empty;

        public decimal ExaminationFee { get; set; }
        public decimal ConsultationFee { get; set; }
        public string Currency { get; set; } = "EGP";

        public string AchievementsJson { get; set; } = "[]";
        public string CertificatesJson { get; set; } = "[]";
        public string LanguagesJson { get; set; } = "[]";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}