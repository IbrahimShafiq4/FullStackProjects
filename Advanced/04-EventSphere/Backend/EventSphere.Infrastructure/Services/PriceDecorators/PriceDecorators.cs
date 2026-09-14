using EventSphere.Domain.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Infrastructure.Services.PriceDecorators
{
    public class EarlyBirdDecorator: IPriceDecorator
    {
        public decimal ApplyDiscount(decimal currentPrice, DateTime eventDate)
        {
            var daysUnitEvent = (eventDate - DateTime.UtcNow).TotalDays;
            return daysUnitEvent > 30 ? currentPrice * 0.8m : currentPrice;
        }
    }
}
