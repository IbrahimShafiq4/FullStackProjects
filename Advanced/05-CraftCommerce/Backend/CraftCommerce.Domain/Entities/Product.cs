using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Domain.Entities
{
    public class Product
    {
        public int                  Id              { get; set; }
        public string               Name            { get; set; } = string.Empty;
        public string               Description     { get; set; } = string.Empty;
        public decimal              Price           { get; set; }
        public int                  StockQuantity   { get; set; }

        public string               ArtisanId       { get; set; } = string.Empty;
        public Artisan              Artisan         { get; set; } = null!;

        public int                  CategoryId      { get; set; }
        public Category             Category        { get; set; } = null!;

        public List<ProductImage>   Images          { get; set; } = new();
        public List<Review>         Reviews         { get; set; } = new();
    }
}
