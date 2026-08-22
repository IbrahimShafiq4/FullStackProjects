using AutoMapper;
using GigLink.Application.DTOs.Gigs;
using GigLink.Application.Interfaces;
using GigLink.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GigLink.API.NewFolder
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GigsController : ControllerBase
    {
        private readonly IGigRepository _gigRepository;
        private readonly IMapper        _mapper;

        public GigsController(IGigRepository gigRepository, IMapper mapper)
        {
            _gigRepository = gigRepository;
            _mapper = mapper;
        }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GigDto>>> GetOpenGigs()
        {
            var gigs = await _gigRepository.GetAllOpenGigsAsync();
            return Ok(_mapper.Map<IEnumerable<GigDto>>(gigs));
        }

        [HttpPost]
        [Authorize(Roles = "Client")]
        public async Task<ActionResult<GigDto>> CreateGig(CreateGigDto dto)
        {
            var gig = new Gig
            {
                Title = dto.Title,
                Description = dto.Description,
                Budget = dto.Budget,
                CreatedAt = DateTime.UtcNow,
                ClientId = GetCurrentUserId()
            };

            await _gigRepository.AddGigAsync(gig);
            await _gigRepository.SaveChangesAsync();

            return Ok(_mapper.Map<GigDto>(gig));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GigDto>> GetGigById(int id)
        {
            var gig = await _gigRepository.GetByIdWithProposalsAsync(id);
            if (gig is null) { return NotFound(); }

            return Ok(_mapper.Map<GigDto>(gig));
        }
    }
}
