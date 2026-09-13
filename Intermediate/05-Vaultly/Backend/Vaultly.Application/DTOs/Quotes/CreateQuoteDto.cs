using System;
using System.Collections.Generic;
using System.Text;
using Vaultly.Domain.Enums;

namespace Vaultly.Application.DTOs.Quotes
{
    public class CreateLineItemDto
    {
        public string Description                   { get; set; } = string.Empty;
        public decimal UnitPrice                    { get; set; }
        public int Quantity                         { get; set; }
    }

    public class CreateQuoteDto
    {
        public string ClientName                    { get; set; } = string.Empty;
        public string ClientEmail                   { get; set; } = string.Empty;
        public TaxType TaxType                      { get; set; }
        public List<CreateLineItemDto> LineItems    { get; set; } = new();
    }
    
}
