using System;
using System.Collections.Generic;

namespace Vaultly.Application.DTOs.Quotes
{
    public class PublicQuoteLineItemDto
    {
        public string Description { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class PublicQuoteDto
    {
        public string FreelancerName { get; set; } = string.Empty;
        public string ClientName { get; set; } = string.Empty;
        public string ClientEmail { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string TaxType { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? SentAt { get; set; }
        public string? ClientNote { get; set; }
        public List<PublicQuoteLineItemDto> LineItems { get; set; } = new();
        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
    }

    public class RespondToQuoteDto
    {
        public bool Accepted { get; set; }
        public string? Note { get; set; }
    }
}