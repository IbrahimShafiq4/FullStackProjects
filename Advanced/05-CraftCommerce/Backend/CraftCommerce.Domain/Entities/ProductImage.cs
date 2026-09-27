using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Domain.Entities
{
    public class ProductImage
    {
        public int      Id          { get; set; }
        public string   Url         { get; set; } = string.Empty;
        public int      ProductId   { get; set; }
        public Product  Product     { get; set; } = null!;
    }
}
