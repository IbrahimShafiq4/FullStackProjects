using AutoMapper;
using GigLink.Application.DTOs.Proposals;
using GigLink.Application.Interfaces;
using GigLink.Application.Services;
using GigLink.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GigLink.API.NewFolder
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProposalsController : ControllerBase
    {
        private readonly IGigRepository             _gigRepository;
        private readonly IProposalDecisionService   _decisionService;
        private readonly IMapper                    _mapper;

        public ProposalsController(IGigRepository gigRepository, IProposalDecisionService decisionService, IMapper mapper)
        { _gigRepository = gigRepository; _decisionService = decisionService; _mapper = mapper; }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost("gig/{gigId}")]
        [Authorize(Roles =  "Freelancer")]
        public async Task<ActionResult<ProposalDto>> SubmitProposal(int gigId, CreateProposalDto dto)
        {
            var gig = await _gigRepository.GetByIdWithProposalsAsync(gigId);
            if (gig is null) return NotFound("المهمة غير موجود.");

            var proposal = new Proposal
            {
                GigId = gigId,
                FreelancerId = GetCurrentUserId(),
                ProposalPrice = dto.ProposedPrice,
                DeliveryDays = dto.DeliveryDays,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow
            };

            await _gigRepository.AddProposalAsync(proposal);
            await _gigRepository.SaveChangesAsync();

            return Ok(_mapper.Map<ProposalDto>(proposal));
        }

        [HttpPatch("{proposalId}/accept")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> AcceptProposal(int proposalId)
        {
            var (success, errorMessage) = await _decisionService.AcceptProposalAsync(proposalId, GetCurrentUserId());

            if (!success)
            {
                return BadRequest(errorMessage);
            }

            return Ok(new { message = "تم قبول العرض، وتم رفض باقي العروض تلقائياً." });
        }
    }
}
