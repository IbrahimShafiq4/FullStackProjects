using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillForge.Application.Interfaces;
using SkillForge.Domain.Entities;
using System.Security.Claims;

namespace SkillForge.API.Controllers
{
    public record CreateCompanyRequest(string Name);

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CompaniesController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public CompaniesController(IAppDbContext context)
        { _context = context; }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost]
        public async Task<IActionResult> CreateCompany([FromBody] CreateCompanyRequest req)
        {
            var company = new Company { Name = req.Name, OwnerId = GetCurrentUserId() };
            await _context.Companies.AddAsync(company);
            await _context.SaveChangesAsync();
            return Ok(new { company.Id });
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyCompany()
        {
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.OwnerId == GetCurrentUserId());
            return company == null ? NotFound() : Ok(new { company.Id, company.Name });
        }
    }
}
