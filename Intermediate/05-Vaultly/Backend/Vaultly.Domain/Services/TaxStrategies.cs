using System;
using System.Collections.Generic;
using System.Text;
using Vaultly.Domain.Enums;

namespace Vaultly.Domain.Services
{
    public interface ITaxStrategies { decimal CalculateTax(decimal subtotal); }
    public class NoTaxStrategy: ITaxStrategies { public decimal CalculateTax(decimal subtotal) => 0; }
    public class FlatVatStrategy: ITaxStrategies
    {
        private const decimal VatRate = 0.14m;
        public decimal CalculateTax(decimal subtotal) => subtotal * VatRate;
    }
    public class TieredTaxStrategy: ITaxStrategies 
    { 
        public decimal CalculateTax(decimal subtotal)
        {
            if (subtotal <= 1000) return subtotal * 0.05m;
            if (subtotal <= 5000) return subtotal * 0.10m;
            return subtotal * 0.15m;
        }
    }

    public static class TaxStrategyFactory
    {
        public static ITaxStrategies Create(TaxType type) => type switch
        { 
            TaxType.None            => new NoTaxStrategy    (),
            TaxType.FlatVat         => new FlatVatStrategy  (),
            TaxType.TieredByAmount  => new TieredTaxStrategy(),
            _                       => new NoTaxStrategy    ()
        };
    }
}