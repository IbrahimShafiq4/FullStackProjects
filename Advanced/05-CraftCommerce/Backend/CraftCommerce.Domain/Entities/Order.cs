using CraftCommerce.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Domain.Entities
{
    public class Order
    {
        public int              Id                  { get; set; }
        public decimal          SubTotal            { get; set; }
        public decimal          ShippingCost        { get; set; }
        public decimal          Total               { get; set; }
        public OrderStatus      Status              { get; set; } = OrderStatus.Pending;
        public DateTime         CreatedAt           { get; set; } = DateTime.UtcNow;
        public string           BuyerId             { get; set; } = string.Empty;
        public int              ShippingAddressId   { get; set; }
        public ShippingAddress  ShippingAddress     { get; set; } = null!;
        public List<OrderItem>  Items               { get; set; } = new();
    }
}
