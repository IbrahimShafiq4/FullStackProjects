using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using R_FIT.Application.Interfaces;
using R_FIT.Domain.Entities;

namespace R_FIT.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class HashtagsController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public HashtagsController(IAppDbContext context)
        { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Hashtags.Select(h => new { h.Id, h.Name }).ToListAsync());

        [HttpGet("{hashtagId:int}")]
        public async Task<IActionResult> GetById(int hashtagId)
        {
            var h = await _context.Hashtags.FindAsync(hashtagId);
            return h == null ? NotFound() : Ok(new { h.Id, h.Name });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] string name)
        {
            var hashtag = new Hashtag { Name = name };
            _context.Hashtags.Add(hashtag);
            await _context.SaveChangesAsync();
            return Ok(new { hashtag.Id });
        }

        [HttpPut("{hashtagId:int}")]
        public async Task<IActionResult> Update(int hashtagId, [FromBody] string name)
        {
            var hashtag = await _context.Hashtags.FindAsync(hashtagId);
            if (hashtag is null) return NotFound();

            hashtag.Name = name;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{hashtagId:int}")]
        public async Task<IActionResult> Delete(int hashtagId)
        {
            var hashtag = await _context.Hashtags.FindAsync(hashtagId);
            if (hashtag is null) return NotFound();

            _context.Hashtags.Remove(hashtag);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
