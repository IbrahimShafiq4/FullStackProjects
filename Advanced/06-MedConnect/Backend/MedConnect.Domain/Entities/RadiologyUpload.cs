using System;

namespace MedConnect.Domain.Entities
{
    public enum PatientFileCategory
    {
        Radiology = 1,
        Prescription = 2,
        LabResult = 3,
        Video = 4,
        Other = 5
    }

    public class RadiologyUpload
    {
        public int Id { get; set; }

        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public string DoctorId { get; set; } = string.Empty;
        public Doctor Doctor { get; set; } = null!;

        public int? RadiologyRequestId { get; set; }

        public PatientFileCategory Category { get; set; } = PatientFileCategory.Radiology;

        public string Title { get; set; } = string.Empty;
        public string ScanType { get; set; } = string.Empty;
        public string BodyPart { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;

        public string FileUrl { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string MimeType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }

        public bool IsExternal { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}