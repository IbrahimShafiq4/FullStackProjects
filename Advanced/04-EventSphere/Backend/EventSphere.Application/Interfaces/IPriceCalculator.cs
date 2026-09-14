using System;
using System.Collections.Generic;
using System.Text;

namespace EventSphere.Application.Interfaces
{
    public interface IPriceCalculator { decimal CalculateFinalPrice(decimal basePrice, DateTime eventDate); }
}
