using ShelfLife.Domain.Entities;
using ShelfLife.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace ShelfLife.Domain.Services
{
    public interface IProductFreshnessCalculator
    {
        ProductFreshness Calculate(Product product, DateTime currentDate);
    }

    public class ProductFreshnessCalculator: IProductFreshnessCalculator
    {
        private const int ExpiringSoonThresholdDays = 3;

        public ProductFreshness Calculate(Product product, DateTime currentDate)
        {
            var daysUnitlExpiry = (product.ExpiryDate.Date - currentDate.Date).Days;

            if (daysUnitlExpiry < 0)
            {
                return ProductFreshness.Expired;
            }

            if (daysUnitlExpiry <= ExpiringSoonThresholdDays)
            {
                return ProductFreshness.ExpiringSoon;
            }

            return ProductFreshness.Fresh;
        }
    }
}
