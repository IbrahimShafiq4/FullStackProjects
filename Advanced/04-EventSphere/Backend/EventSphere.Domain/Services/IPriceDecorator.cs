using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Domain.Services
{
    public interface IPriceDecorator
    {
        decimal ApplyDiscount(decimal currentPrice, DateTime eventDate);
    }
}
