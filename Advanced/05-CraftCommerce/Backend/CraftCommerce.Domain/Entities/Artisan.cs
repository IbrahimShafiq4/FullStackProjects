using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Domain.Entities
{
    public class Artisan: IdentityUser
    {
        public string           StoreName   { get; set; } = string.Empty;
        public string           Bio         { get; set; } = string.Empty;
        public List<Product>    Products    { get; set; } = new();
    }
}
