using System;
using System.Collections.Generic;
using System.Text;

namespace ShelfLife.Application.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string Freshness { get; set; } = string.Empty;
        public string? PhotoUrl { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? VoiceNoteUrl { get; set; }
    }
}