using CraftCommerce.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Domain.Entities
{
    public class ShippingAddress
    {
        public int          Id          { get; set; }
        public string       Country     { get; set; } = string.Empty;
        public string       City        { get; set; } = string.Empty;
        public string       FullAddress { get; set; } = string.Empty;
        public ShippingZone Zone        { get; set; }
        public string       BuyerId     { get; set; } = string.Empty;

    }
}
