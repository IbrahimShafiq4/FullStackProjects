using System;
using System.Collections.Generic;
using System.Text;

namespace ShelfLife.Domain.Entities
{
    public class Product
    {
        public int      Id              { get; set; }
        public string   Name            { get; set; } = string.Empty;
        public int      Quantity        { get; set; }
        public DateTime ExpiryDate      { get; set; }
        public DateTime AddedAt         { get; set; } = DateTime.UtcNow;

        public string?  PhotoUrl        { get; set; }
        public string?  VoiceNoteUrl    { get; set; }

        public string   AppUserId       { get; set; } = string.Empty;
        public AppUser  AppUser         { get; set; } = null!;
    }
}
