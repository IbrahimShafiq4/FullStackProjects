using System;
using System.Collections.Generic;
using System.Text;
using Vaultly.Domain.Entities;

namespace Vaultly.Domain.Services
{
    public interface IQuoteCalculator { (decimal subtotal, decimal tax, decimal total) Calculate(Quote quote); }

    public class QuoteCalculator: IQuoteCalculator
    {
        public (decimal subtotal, decimal tax, decimal total) Calculate(Quote quote)
        {
            var subtotal = quote.LineItems.Sum(item => item.Subtotal);

            var taxStrategy = TaxStrategyFactory.Create(quote.TaxType);
            var tax = taxStrategy.CalculateTax(subtotal);

            return (subtotal, tax, subtotal + tax);
        }
    }
}
