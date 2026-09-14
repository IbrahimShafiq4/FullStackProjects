using EventSphere.Domain.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Infrastructure.Services.PriceDecorators
{
    public class LastMinuteDecorator: IPriceDecorator
    {
        public decimal ApplyDiscount(decimal currentPrice, DateTime eventDate)
        {
            var daysUntilEvent = (eventDate - DateTime.UtcNow).TotalDays;
            return daysUntilEvent < 3 ? currentPrice * 1.15m : currentPrice;
        }
    }
}
