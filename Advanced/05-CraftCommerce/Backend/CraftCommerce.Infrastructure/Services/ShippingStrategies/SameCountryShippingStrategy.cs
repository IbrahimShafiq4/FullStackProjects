using CraftCommerce.Domain.Enums;
using CraftCommerce.Domain.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Infrastructure.Services.ShippingStrategies
{
    public class SameCountryShippingStrategy: IShippingStrategy
    {
        public decimal CalculateShippingCost(ShippingZone zone, decimal orderSubtotal) =>
            orderSubtotal > 500 ? 0M : 50M;
    }
}
