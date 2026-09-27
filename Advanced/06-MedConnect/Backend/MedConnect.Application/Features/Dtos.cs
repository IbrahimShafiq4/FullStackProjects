namespace MedConnect.Application.Features
{
    public record RegisterDoctorDto(string FullName, string Specialty, string Email, string Password);
    public record RegisterPatientDto(string FullName, string Email, string Password);
    public record LoginDto(string Email, string Password);
    public record DoctorDto(string Id, string FullName, string Specialty);
    public record CreateSlotDto(DayOfWeek DayOfWeek, TimeSpan StartTime, TimeSpan EndTime);
    public record BookAppointmentDto(
        string DoctorId,
        DateTime ScheduledAt,
        string? PatientComplaint,
        string? PaymentMethod,
        bool PayOnline);

    public record AppointmentDto(
        int Id,
        DateTime ScheduledAt,
        string Status,
        string DoctorId,
        string DoctorName,
        string PatientName,
        string PatientComplaint);

    public record PrescriptionMedicationDto(
        string Name,
        string Dose,
        string Frequency,
        string Duration,
        string? Notes);

    public record CreatePrescriptionDto(
        List<PrescriptionMedicationDto> Medications,
        string Notes);

    public record AchievementDto(string Title, string Year, string Description);
    public record CertificateDto(string Title, string Issuer, string Year);

    public record UpdateDoctorProfileDto(
        string? PhotoUrl,
        string? Bio,
        int? YearsOfExperience,
        string? ClinicName,
        string? ClinicAddress,
        string? ClinicPhone,
        string? ClinicHours,
        decimal? ExaminationFee,
        decimal? ConsultationFee,
        string? Currency,
        List<AchievementDto>? Achievements,
        List<CertificateDto>? Certificates,
        List<string>? Languages);

    public record DoctorProfileDto(
        string DoctorId,
        string FullName,
        string Specialty,
        string PhotoUrl,
        string Bio,
        int YearsOfExperience,
        string ClinicName,
        string ClinicAddress,
        string ClinicPhone,
        string ClinicHours,
        decimal ExaminationFee,
        decimal ConsultationFee,
        string Currency,
        List<AchievementDto> Achievements,
        List<CertificateDto> Certificates,
        List<string> Languages);

    public record QueueTicketDto(
        int Id,
        int TicketNumber,
        string Status,
        DateTime IssuedAt,
        DateTime? CalledAt,
        int PatientId,
        string PatientName,
        string DoctorId,
        string DoctorName,
        string DoctorSpecialty,
        int? AppointmentId);

    public record QueueStatusDto(
        string DoctorId,
        int TotalWaiting,
        int CurrentTicketNumber,
        QueueTicketDto? CurrentlyServing,
        List<QueueTicketDto> Waiting,
        List<QueueTicketDto> TodayAll,
        List<AppointmentDto> TodayAppointments);

    public record NotificationDto(
        int Id,
        string Type,
        string Title,
        string Body,
        string Link,
        bool IsRead,
        DateTime CreatedAt);

    public record PatientProfileDto(
        int PatientId,
        string FullName,
        string PhotoUrl,
        string BloodType,
        DateTime? DateOfBirth,
        string Gender,
        string Phone,
        string Address,
        string EmergencyContact,
        string EmergencyPhone,
        List<string> ChronicDiseases,
        List<string> Allergies,
        List<string> CurrentMedications);

    public record UpdatePatientProfileDto(
        string? PhotoUrl,
        string? BloodType,
        DateTime? DateOfBirth,
        string? Gender,
        string? Phone,
        string? Address,
        string? EmergencyContact,
        string? EmergencyPhone,
        List<string>? ChronicDiseases,
        List<string>? Allergies,
        List<string>? CurrentMedications);

    public record CreateMedicalRecordDto(
        int AppointmentId,
        string ChiefComplaint,
        string Diagnosis,
        string ExaminationNotes,
        string TreatmentPlan,
        string FollowUpNotes,
        Dictionary<string, string>? Vitals);

    public record UpdateMedicalRecordDto(
        string? ChiefComplaint,
        string? Diagnosis,
        string? ExaminationNotes,
        string? TreatmentPlan,
        string? FollowUpNotes,
        Dictionary<string, string>? Vitals);

    public record TreatmentStageDto(
        int Id,
        int Order,
        string Title,
        string Description,
        string Status,
        DateTime? StartDate,
        DateTime? EndDate,
        string Notes);

    public record MedicalRecordDto(
        int Id,
        int AppointmentId,
        DateTime ScheduledAt,
        string PatientName,
        string DoctorName,
        string ChiefComplaint,
        string Diagnosis,
        string ExaminationNotes,
        string TreatmentPlan,
        string FollowUpNotes,
        Dictionary<string, string> Vitals,
        List<TreatmentStageDto> Stages,
        DateTime CreatedAt,
        DateTime UpdatedAt);

    public record CreateTreatmentStageDto(
        string Title,
        string Description,
        DateTime? StartDate,
        DateTime? EndDate,
        string Notes);

    public record UpdateTreatmentStageDto(
        string? Title,
        string? Description,
        string? Status,
        DateTime? StartDate,
        DateTime? EndDate,
        string? Notes);

    public record RadiologyRequestDto(
        int Id,
        int AppointmentId,
        string PatientName,
        string DoctorName,
        string ScanType,
        string BodyPart,
        string Instructions,
        string Status,
        DateTime RequestedAt,
        DateTime? FulfilledAt);

    public record CreateRadiologyRequestDto(
        int AppointmentId,
        string ScanType,
        string BodyPart,
        string Instructions);

    public record RadiologyUploadDto(
        int Id,
        int? RadiologyRequestId,
        int PatientId,
        string PatientName,
        string DoctorId,
        string DoctorName,
        string Category,
        string Title,
        string ScanType,
        string BodyPart,
        string Notes,
        string FileUrl,
        string FileName,
        string MimeType,
        long FileSizeBytes,
        bool IsExternal,
        DateTime UploadedAt);

    public record CreateRadiologyUploadDto(
        string DoctorId,
        int? RadiologyRequestId,
        string? Category,
        string? Title,
        string? ScanType,
        string? BodyPart,
        string? Notes,
        bool IsExternal);

    public record ReviewDto(
        int Id,
        string DoctorId,
        string DoctorName,
        int PatientId,
        string PatientName,
        int Rating,
        string Comment,
        DateTime CreatedAt);

    public record CreateReviewDto(
        string DoctorId,
        int? AppointmentId,
        int Rating,
        string Comment);

    public record ReviewSummaryDto(
        string DoctorId,
        double AverageRating,
        int TotalReviews,
        Dictionary<int, int> RatingDistribution);

    public record InvoiceLineDto(string Description, decimal Amount);

    public record InvoiceDto(
        int Id,
        int AppointmentId,
        DateTime AppointmentDate,
        string DoctorName,
        string PatientName,
        decimal ExaminationFee,
        decimal ConsultationFee,
        decimal OtherFees,
        decimal Discount,
        decimal TotalAmount,
        decimal PaidAmount,
        decimal RemainingAmount,
        string Currency,
        string Status,
        string Notes,
        DateTime IssuedAt,
        DateTime? PaidAt,
        List<PaymentDto> Payments);

    public record CreateInvoiceDto(
        int AppointmentId,
        decimal ExaminationFee,
        decimal ConsultationFee,
        decimal OtherFees,
        decimal Discount,
        string? Notes);

    public record PaymentDto(
        int Id,
        int InvoiceId,
        decimal Amount,
        string Currency,
        string Method,
        string Status,
        string TransactionRef,
        string Notes,
        DateTime CreatedAt,
        DateTime? CompletedAt);

    public record CreatePaymentDto(
        int InvoiceId,
        decimal Amount,
        string Method,
        string? TransactionRef,
        string? Notes);

    public record PatientDashboardDto(
        int TotalVisits,
        decimal TotalPaid,
        int DoctorsVisited,
        int PendingInvoices,
        List<DoctorVisitSummaryDto> RecentVisits,
        List<InvoiceDto> RecentInvoices,
        List<ReviewDto> MyReviews,
        List<RadiologyUploadDto> RecentUploads,
        List<AppointmentDto> UpcomingAppointments);

    public record DoctorVisitSummaryDto(
        string DoctorId,
        string DoctorName,
        string DoctorSpecialty,
        string DoctorPhotoUrl,
        int TotalVisits,
        decimal TotalPaid,
        DateTime LastVisitAt,
        double? MyRating,
        bool HasReview);

    public record FeaturedDoctorDto(
        string Id,
        string FullName,
        string Specialty,
        string PhotoUrl,
        int YearsOfExperience,
        decimal ExaminationFee,
        string Currency,
        double AverageRating,
        int TotalReviews);
}