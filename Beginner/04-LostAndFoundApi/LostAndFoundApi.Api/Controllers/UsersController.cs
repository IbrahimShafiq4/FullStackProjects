using LostAndFoundApi.Api.Context;
using LostAndFoundApi.Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LostAndFoundApi.Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            var dto = new UserDto
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Email = user.Email!
            };

            return Ok(dto);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    DisplayName = u.DisplayName,
                    Email = u.Email!
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}
