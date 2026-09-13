using System;
using System.Collections.Generic;
using System.Text;

namespace Vaultly.Domain.Entities
{
    public class QuoteLineItem
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }

        public decimal Subtotal => UnitPrice * Quantity;

        public int QuoteId { get; set; }
        public Quote Quote { get; set; } = null!;
    }
}
