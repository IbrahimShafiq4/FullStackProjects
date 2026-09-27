using System;
using System.Collections.Generic;

namespace MedConnect.Domain.Entities
{
    public enum InvoiceStatus
    {
        Unpaid = 1,
        Paid = 2,
        PartiallyPaid = 3,
        Cancelled = 4
    }

    public class Invoice
    {
        public int Id { get; set; }

        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; } = null!;

        public int PatientId { get; set; }
        public string DoctorId { get; set; } = string.Empty;

        public decimal ExaminationFee { get; set; }
        public decimal ConsultationFee { get; set; }
        public decimal OtherFees { get; set; }
        public decimal Discount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }

        public string Currency { get; set; } = "EGP";
        public InvoiceStatus Status { get; set; } = InvoiceStatus.Unpaid;

        public string Notes { get; set; } = string.Empty;

        public List<Payment> Payments { get; set; } = new();

        public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAt { get; set; }
    }
}