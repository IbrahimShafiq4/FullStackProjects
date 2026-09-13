using System;
using System.Collections.Generic;
using System.Text;
using Vaultly.Domain.Enums;

namespace Vaultly.Domain.Services
{
    public interface IQuoteStateManager { bool CanTransition(QuoteStatus current, QuoteStatus target); }

    public class QuoteStateManager: IQuoteStateManager
    {
        private static readonly Dictionary<QuoteStatus, QuoteStatus[]> AllowedTransions = new()
        {
            [QuoteStatus.Draft]     = new[] { QuoteStatus.Sent },
            [QuoteStatus.Sent]      = new[] { QuoteStatus.Accepted, QuoteStatus.Rejected },
            [QuoteStatus.Accepted]  = new[] { QuoteStatus.Invoiced },
            [QuoteStatus.Rejected]  = Array.Empty<QuoteStatus>(),
            [QuoteStatus.Invoiced]  = Array.Empty<QuoteStatus>()
        };

        public bool CanTransition(QuoteStatus current, QuoteStatus target) =>
            AllowedTransions.TryGetValue(current, out var allowed) && allowed.Contains(target);
    }
}
