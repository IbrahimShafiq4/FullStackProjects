using System;
using System.Collections.Generic;
using System.Text;

namespace Vaultly.Application.DTOs.Quotes
{
    public class QuoteLineItemDto
    {
        public int Id                           { get; set; }
        public string Description               { get; set; } = string.Empty;
        public decimal UnitPrice                { get; set; }
        public int Quantity                     { get; set; }
        public decimal Subtotal                 { get; set; }
    }

    public class QuoteDto
    {
        public int Id                           { get; set; }
        public string ClientName                { get; set; } = string.Empty;
        public string ClientEmail               { get; set; } = string.Empty;
        public string Status                    { get; set; } = string.Empty;
        public string TaxType                   { get; set; } = string.Empty;
        public List<QuoteLineItemDto> LineItems { get; set; } = new();
        public decimal Subtotal                 { get; set; }
        public decimal Tax                      { get; set; }
        public decimal Total                    { get; set; }
    }
}
