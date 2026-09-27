using MedConnect.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MedConnect.Application.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<Doctor> Doctors { get; }
        DbSet<Patient> Patients { get; }
        DbSet<AvailabilitySlot> AvailabilitySlots { get; }
        DbSet<Appointment> Appointments { get; }
        DbSet<Prescription> Prescriptions { get; }
        DbSet<DoctorProfile> DoctorProfiles { get; }
        DbSet<PatientProfile> PatientProfiles { get; }
        DbSet<QueueTicket> QueueTickets { get; }
        DbSet<Notification> Notifications { get; }
        DbSet<MedicalRecord> MedicalRecords { get; }
        DbSet<TreatmentStage> TreatmentStages { get; }
        DbSet<RadiologyRequest> RadiologyRequests { get; }
        DbSet<RadiologyUpload> RadiologyUploads { get; }
        DbSet<Review> Reviews { get; }
        DbSet<Invoice> Invoices { get; }
        DbSet<Payment> Payments { get; }
        DbSet<IdentityUserClaim<string>> UserClaims { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}