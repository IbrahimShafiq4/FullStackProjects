using System;
using System.Collections.Generic;
using System.Text;

namespace ShelfLife.Domain.Entities
{
    public class RecipeVideo
    {
        public int              Id              { get; set; }
        public string           Title           { get; set; } = string.Empty;
        public string           VideoUrl        { get; set; } = string.Empty;
        public DateTime         CreatedAt       { get; set; } = DateTime.UtcNow;

        public string           AppUserId       { get; set; } = string.Empty;
        public AppUser          AppUser         { get; set; } = null!;

        public List<Product>    UsedProducts    { get; set; } = new();
    }
}
