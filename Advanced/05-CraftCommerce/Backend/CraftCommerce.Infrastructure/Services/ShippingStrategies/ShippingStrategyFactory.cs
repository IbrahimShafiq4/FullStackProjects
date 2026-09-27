using CraftCommerce.Domain.Enums;
using CraftCommerce.Domain.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace CraftCommerce.Infrastructure.Services.ShippingStrategies
{
    public interface IShippingStrategyFactory
    {
        IShippingStrategy GetStrategy(ShippingZone zone);
    }

    public class ShippingStrategyFactory: IShippingStrategyFactory
    {
        private readonly Dictionary<ShippingZone, IShippingStrategy> _strategies = new()
        {
            [ShippingZone.SameCity]         = new SameCityShippingStrategy(),
            [ShippingZone.SameCountry]      = new SameCountryShippingStrategy(),
            [ShippingZone.International]    = new InternationalShippingStrategy(),
        };

        public IShippingStrategy GetStrategy(ShippingZone zone) =>
            _strategies[zone];
    }
}
