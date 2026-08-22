using Microsoft.AspNetCore.Mvc;
using TaskFlow.Api.Repositories;

namespace TaskFlow.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserStreaksController : ControllerBase
    {
        private readonly IUserStreakRepository _repo;

        public UserStreaksController(IUserStreakRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var streak = await _repo.GetByIdAsync(id);
            if (streak == null)
                return NotFound();

            return Ok(new
            {
                streak.Id,
                streak.CurrentStreak,
                streak.LongestStreak,
                streak.LastCompletionDate
            });
        }
    }
}