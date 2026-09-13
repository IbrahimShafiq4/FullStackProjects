using System;
using System.Collections.Generic;
using System.Text;

namespace ShelfLife.Application.DTOs
{
    public class RecipeVideoDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public List<string> UsedProductNames { get; set; } = new();
    }
}
