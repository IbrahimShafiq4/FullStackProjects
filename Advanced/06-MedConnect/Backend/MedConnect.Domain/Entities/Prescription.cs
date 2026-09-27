using System;
using System.Collections.Generic;
using System.Text;

namespace MedConnect.Domain.Entities
{
    public class Prescription
    {
        public int Id { get; set; }
        public string MedicationsJson { get; set; } = "[]";
        public string Notes { get; set; } = string.Empty;
        public string PdfUrl { get; set; } = string.Empty;
        public DateTime IssuedAt { get; set; } = DateTime.UtcNow;

        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; } = null!;
    }
}