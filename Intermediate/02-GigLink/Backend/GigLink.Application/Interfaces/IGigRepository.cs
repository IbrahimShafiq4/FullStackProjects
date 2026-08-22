using GigLink.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GigLink.Application.Interfaces
{
    public interface IGigRepository
    {
        Task<IEnumerable<Gig>>  GetAllOpenGigsAsync();
        Task<Gig?>              GetByIdWithProposalsAsync(int id);
        Task                    AddGigAsync(Gig gig);
        Task<Proposal?>         GetProposalByIdAsync(int proposalId);
        Task                    AddProposalAsync(Proposal proposal);
        Task                    SaveChangesAsync();
    }
}
