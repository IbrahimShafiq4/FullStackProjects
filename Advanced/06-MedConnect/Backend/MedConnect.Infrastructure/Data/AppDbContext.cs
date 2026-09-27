using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MedConnect.Application.Interfaces;
using MedConnect.Domain.Entities;

namespace MedConnect.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<Doctor>, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Patient> Patients { get; set; } = null!;
        public DbSet<AvailabilitySlot> AvailabilitySlots { get; set; } = null!;
        public DbSet<Appointment> Appointments { get; set; } = null!;
        public DbSet<Prescription> Prescriptions { get; set; } = null!;
        public DbSet<DoctorProfile> DoctorProfiles { get; set; } = null!;
        public DbSet<PatientProfile> PatientProfiles { get; set; } = null!;
        public DbSet<QueueTicket> QueueTickets { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;
        public DbSet<MedicalRecord> MedicalRecords { get; set; } = null!;
        public DbSet<TreatmentStage> TreatmentStages { get; set; } = null!;
        public DbSet<RadiologyRequest> RadiologyRequests { get; set; } = null!;
        public DbSet<RadiologyUpload> RadiologyUploads { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;
        public DbSet<Invoice> Invoices { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;

        Microsoft.EntityFrameworkCore.DbSet<Doctor> IAppDbContext.Doctors
            => Users as DbSet<Doctor> ?? Set<Doctor>();

        Microsoft.EntityFrameworkCore.DbSet<IdentityUserClaim<string>> IAppDbContext.UserClaims
            => UserClaims;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Prescription)
                .WithOne(p => p.Appointment)
                .HasForeignKey<Prescription>(p => p.AppointmentId);

            modelBuilder.Entity<DoctorProfile>()
                .HasOne(p => p.Doctor).WithOne()
                .HasForeignKey<DoctorProfile>(p => p.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PatientProfile>()
                .HasOne(p => p.Patient).WithOne()
                .HasForeignKey<PatientProfile>(p => p.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<QueueTicket>()
                .HasOne(q => q.Doctor).WithMany()
                .HasForeignKey(q => q.DoctorId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<QueueTicket>()
                .HasOne(q => q.Patient).WithMany()
                .HasForeignKey(q => q.PatientId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<QueueTicket>()
                .HasOne(q => q.Appointment).WithMany()
                .HasForeignKey(q => q.AppointmentId).OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<QueueTicket>()
                .HasIndex(q => new { q.DoctorId, q.Status, q.IssuedAt });

            modelBuilder.Entity<Notification>()
                .HasIndex(n => new { n.UserId, n.IsRead, n.CreatedAt });

            modelBuilder.Entity<MedicalRecord>()
                .HasOne(m => m.Appointment).WithMany()
                .HasForeignKey(m => m.AppointmentId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TreatmentStage>()
                .HasOne(t => t.MedicalRecord).WithMany(m => m.Stages)
                .HasForeignKey(t => t.MedicalRecordId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RadiologyRequest>()
                .HasOne(r => r.Appointment).WithMany()
                .HasForeignKey(r => r.AppointmentId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RadiologyUpload>()
                .HasOne(r => r.Patient).WithMany()
                .HasForeignKey(r => r.PatientId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RadiologyUpload>()
                .HasOne(r => r.Doctor).WithMany()
                .HasForeignKey(r => r.DoctorId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Doctor).WithMany()
                .HasForeignKey(r => r.DoctorId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Patient).WithMany()
                .HasForeignKey(r => r.PatientId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Appointment).WithMany()
                .HasForeignKey(i => i.AppointmentId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Invoice).WithMany()
                .HasForeignKey(p => p.InvoiceId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}