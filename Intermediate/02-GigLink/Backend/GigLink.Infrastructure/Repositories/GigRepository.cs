using GigLink.Application.Interfaces;
using GigLink.Domain.Entities;
using GigLink.Domain.Enums;
using GigLink.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace GigLink.Infrastructure.Repositories
{
    public class GigRepository: IGigRepository
    {
        private readonly AppDbContext _context;

        public GigRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Gig>> GetAllOpenGigsAsync() =>
            await _context.Gigs
                .Include(g => g.Client)
                .Where(g => g.Status == Domain.Enums.GigStatus.Open)
                .OrderByDescending(g => g.CreatedAt)
                .ToListAsync();

        public async Task<Gig?> GetByIdWithProposalsAsync(int id) =>
            await _context.Gigs
                .Include(g => g.Client)
                .Include(g => g.Proposals)
                    .ThenInclude(p => p.Freelancer)
                .FirstOrDefaultAsync(g => g.Id == id);

        public async Task AddGigAsync(Gig gig) =>
        
            await _context.Gigs.AddAsync(gig);
        

        public async Task<Proposal?> GetProposalByIdAsync(int proposalId) =>
            await _context.Proposals
                .Include(p => p.Freelancer)
                .FirstOrDefaultAsync(p => p.Id == proposalId);

        public async Task AddProposalAsync(Proposal proposal) =>
            await _context.Proposals.AddAsync(proposal);

        public async Task SaveChangesAsync() =>
            await _context.SaveChangesAsync();
    }
}
