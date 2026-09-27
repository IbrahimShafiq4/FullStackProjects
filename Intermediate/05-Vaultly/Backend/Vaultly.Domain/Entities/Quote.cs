using System;
using System.Collections.Generic;
using System.Text;
using Vaultly.Domain.Enums;

namespace Vaultly.Domain.Entities
{
    public class Quote
    {
        public int Id { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public string ClientEmail { get; set; } = string.Empty;
        public QuoteStatus Status { get; set; } = QuoteStatus.Draft;
        public TaxType TaxType { get; set; } = TaxType.FlatVat;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string FreelancerId { get; set; } = string.Empty;
        public AppUser Freelancer { get; set; } = null!;
        public List<QuoteLineItem> LineItems { get; set; } = new();

        public string? PublicToken { get; set; }
        public DateTime? SentAt { get; set; }
        public DateTime? ClientViewedAt { get; set; }
        public DateTime? ClientRespondedAt { get; set; }
        public string? ClientNote { get; set; }
    }
}