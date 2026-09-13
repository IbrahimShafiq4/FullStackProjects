using System;
using System.Collections.Generic;
using System.Text;

namespace ShelfLife.Application.DTOs
{
    public class CreateProductDto
    {
        public string   Name        { get; set; } = string.Empty;
        public int      Quantity    { get; set; }
        public DateTime ExpiryDate  { get; set; }
    }
}
