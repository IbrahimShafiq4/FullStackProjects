using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Domain.Entities
{
    public class CartItem
    {
        public int      Id          { get; set; }
        public int      Quantity    { get; set; }
        public string   BuyerId     { get; set; } = string.Empty;
        public int      ProductId   { get; set; }
        public Product  Product     { get; set; } = null!;
    }
}
