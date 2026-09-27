using CraftCommerce.Domain.Enums;
using CraftCommerce.Domain.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Infrastructure.Services.ShippingStrategies
{
    public class SameCityShippingStrategy: IShippingStrategy
    {
        public decimal CalculateShippingCost(ShippingZone zone, decimal orderSubtotal) => 20M;
    }
}
