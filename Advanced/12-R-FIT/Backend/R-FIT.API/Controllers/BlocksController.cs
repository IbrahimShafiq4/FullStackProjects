using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using R_FIT.Application.Interfaces;
using R_FIT.Domain.Entities;
using System.Security.Claims;

namespace R_FIT.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BlocksController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public BlocksController(IAppDbContext context)
        { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Blocks.Where(b => b.BlockerId == GetCurrentUserId()).Select(b => new { b.Id, b.BlockedId, b.BlockedAt }).ToListAsync());

        [HttpGet("blockId:int")]
        public async Task<IActionResult> GetById(int blockId)
        {
            var block = await _context.Blocks.FindAsync(blockId);
            return block == null ? NotFound() : Ok(new { block.Id, block.BlockedId, block.BlockedAt });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] string blockedId)
        {
            var block = new Block { BlockerId = GetCurrentUserId(), BlockedId = blockedId };
            _context.Blocks.Add(block);
            await _context.SaveChangesAsync();
            return Ok(new { block.Id });
        }

        [HttpPut("{blockId:int}")]
        public async Task<IActionResult> Update(int blockId)
        {
            var block = await _context.Blocks.FindAsync(blockId);
            if (block is null) return NotFound();

            block.BlockedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var block = await _context.Blocks.FindAsync(id);
            if (block == null) return NotFound();
            if (block.BlockerId != GetCurrentUserId()) return Forbid();
            _context.Blocks.Remove(block);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
