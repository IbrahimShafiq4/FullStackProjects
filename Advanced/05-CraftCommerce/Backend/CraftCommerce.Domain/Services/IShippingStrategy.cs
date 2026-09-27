using CraftCommerce.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Domain.Services
{
    public interface IShippingStrategy
    {
        decimal CalculateShippingCost(ShippingZone zone, decimal orderSubtotal);
    }
}
