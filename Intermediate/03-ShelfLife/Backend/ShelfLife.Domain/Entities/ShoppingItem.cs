using System;
using System.Collections.Generic;
using System.Text;

namespace ShelfLife.Domain.Entities
{
    public class ShoppingItem
    {
        public int      Id          { get; set; }
        public string   Name        { get; set; } = string.Empty;
        public int      Quantity    { get; set; } = 1;
        public bool     IsPurchased { get; set; }
        public DateTime AddedAt     { get; set; } = DateTime.UtcNow;

        public string   AppUserId   { get; set; } = string.Empty;
        public AppUser  AppUser     { get; set; } = null!;
    }
}
