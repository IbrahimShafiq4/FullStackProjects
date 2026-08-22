using GigLink.Application.Interfaces;
using GigLink.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Reflection.Metadata.Ecma335;
using System.Text;

namespace GigLink.Application.Services
{
    public interface IProposalDecisionService
    {
        Task<(bool success, string? errorMessage)> AcceptProposalAsync(int proposalId, string requestingUserId);
    }

    public class ProposalDecisionService: IProposalDecisionService
    {
        private readonly IGigRepository _gigRepository;

        public ProposalDecisionService(IGigRepository gigRepository)
        { _gigRepository = gigRepository; }

        public async Task<(bool success, string? errorMessage)> AcceptProposalAsync(int proposalId, string requestingUserId)
        {

            var proposal = await _gigRepository.GetProposalByIdAsync(proposalId);

            if (proposal is null) { return (false, "العرض غير موجود."); }

            var gig = await _gigRepository.GetByIdWithProposalsAsync(proposal.GigId);
            if(gig is null) { return (false, "المهمة غير موجودة"); }

            if (gig.Status != GigStatus.Open) { return (false, "هذه المهمة لم تعد تقبل عروضا جديدة."); }

            foreach(var p in gig.Proposals)
            {
                if (p.Id == proposalId) { p.Status = ProposalStatus.Accepted; }
                else if (p.Status == ProposalStatus.Pending) { p.Status = ProposalStatus.Rejected; }
            }

            gig.Status = GigStatus.InProgress;

            await _gigRepository.SaveChangesAsync();

            return (true, null);
        }
    }
}
