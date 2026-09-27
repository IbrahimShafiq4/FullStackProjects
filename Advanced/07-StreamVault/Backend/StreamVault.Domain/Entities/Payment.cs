using StreamVault.Domain.Entities;
using System;

namespace StreamVault.Domain.Domain
{
    public enum PaymentStatus { Pending = 1, Succeeded = 2, Failed = 3, Refunded = 4 }
    public enum PaymentProvider { Dummy = 1, Stripe = 2, Paymob = 3 }
    public enum PaymentPurpose { Subscription = 1, Course = 2, StudyFile = 3 }

    public class Payment
    {
        public int              Id                      { get; set; }
        public string           StudentId               { get; set; } = string.Empty;
        public Instructor       Student                 { get; set; } = null!;
        public string?          TeacherId               { get; set; }
        public Instructor?      Teacher                 { get; set; }
        public PaymentPurpose   Purpose                 { get; set; }
        public int?             CourseId                { get; set; }
        public Course?          Course                  { get; set; }
        public int?             StudyFileId             { get; set; }
        public StudyFile?       StudyFile               { get; set; }
        public decimal          Amount                  { get; set; }
        public string           Currency                { get; set; } = "EGP";
        public PaymentStatus    Status                  { get; set; } = PaymentStatus.Pending;
        public PaymentProvider  Provider                { get; set; } = PaymentProvider.Dummy;
        public string?          ProviderTransactionId   { get; set; }
        public string           Description             { get; set; } = string.Empty;
        public DateTime         CreatedAt               { get; set; } = DateTime.UtcNow;
        public DateTime?        CompletedAt             { get; set; }
    }
}