using EventSphere.Domain.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Infrastructure.Services.PriceDecorators
{
    public class WeekendSurchargeDecorator: IPriceDecorator
    {
        public decimal ApplyDiscount(decimal currentPrice, DateTime eventDate)
        {
            var isWeekend = eventDate.DayOfWeek is DayOfWeek.Friday or DayOfWeek.Saturday;
            return isWeekend ? currentPrice * 1.10m : currentPrice;
        }
    }
}
