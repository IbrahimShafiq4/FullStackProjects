using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Vaultly.Application.Interfaces;
using Vaultly.Domain.Entities;
using Vaultly.Infrastructure.Data;

namespace Vaultly.Infrastructure.Repositories
{
    public class QuoteRepository: IQuoteReader, IQuoteWriter
    {
        private AppDbContext _context;
        public QuoteRepository(AppDbContext context)
        { _context = context; }

        public async Task<List<Quote>> GetAllForUserAsync(string userId) =>
            await _context.Quotes
                .Include(q => q.LineItems)
                .Where(q => q.FreelancerId == userId)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

        public async Task<Quote?> GetByIdAsync(int id) =>
            await _context.Quotes.Include(q => q.LineItems).FirstOrDefaultAsync(q => q.Id == id);

        public async Task AddAsync(Quote quote) =>
            await _context.AddAsync(quote);

        public async Task SaveChangesAsync() =>
            await _context.SaveChangesAsync();
    }
}
