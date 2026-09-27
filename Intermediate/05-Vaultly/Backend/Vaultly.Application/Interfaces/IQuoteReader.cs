using System;
using System.Collections.Generic;
using System.Text;
using Vaultly.Domain.Entities;

namespace Vaultly.Application.Interfaces
{
    public interface IQuoteReader
    {
        Task<List<Quote>>   GetAllForUserAsync(string userId);
        Task<Quote?>        GetByIdAsync(int id);
        Task<Quote?>        GetByPublicTokenAsync(string token);
    }
}