using EventSphere.Application.Interfaces;
using EventSphere.Domain.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Infrastructure.Services.PriceDecorators
{
    public class PriceCalculator: IPriceCalculator
    {
        private readonly List<IPriceDecorator> _decorators;

        public PriceCalculator()
        {
            _decorators = new List<IPriceDecorator>
            {
                new EarlyBirdDecorator(),
                new WeekendSurchargeDecorator(),
                new LastMinuteDecorator()
            };
        }

        public decimal CalculateFinalPrice(decimal basePrice, DateTime eventDate)
        {
            var price = basePrice;

            foreach(var decorator in _decorators)
            {
                price = decorator.ApplyDiscount(price, eventDate);
            }

            return Math.Round(price, 2);
        }
    }
}
