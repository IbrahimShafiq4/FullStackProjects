using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShelfLife.Domain.Entities;
using System.Security.Claims;

namespace ShelfLife.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;

        public AdminController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        private async Task<bool> IsCurrentUserAdminAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return false;

            var user = await _userManager.FindByIdAsync(userId);
            return user?.IsAdmin ?? false;
        }

        [HttpGet("users")]
        [Authorize]
        public async Task<IActionResult> GetAllUsers()
        {
            if (!await IsCurrentUserAdminAsync()) return Forbid();

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var users = await _userManager.Users
                .OrderByDescending(u => u.IsAdmin)
                .ThenBy(u => u.FullName)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.IsAdmin,
                    isCurrentUser = u.Id == currentUserId
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("promote/{userId}")]
        [Authorize]
        public async Task<IActionResult> PromoteToAdmin(string userId)
        {
            if (!await IsCurrentUserAdminAsync()) return Forbid();

            var user = await _userManager.FindByIdAsync(userId);
            if (user is null) return NotFound(new { message = "المستخدم مش موجود" });

            if (user.IsAdmin) return BadRequest(new { message = "المستخدم أدمن بالفعل" });

            user.IsAdmin = true;
            await _userManager.UpdateAsync(user);

            return Ok(new { message = $"{user.FullName} أصبح أدمن" });
        }

        [HttpPost("demote/{userId}")]
        [Authorize]
        public async Task<IActionResult> DemoteFromAdmin(string userId)
        {
            if (!await IsCurrentUserAdminAsync()) return Forbid();

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId == userId)
                return BadRequest(new { message = "مش ممكن تشيل نفسك من الأدمن" });

            var user = await _userManager.FindByIdAsync(userId);
            if (user is null) return NotFound(new { message = "المستخدم مش موجود" });

            if (!user.IsAdmin) return BadRequest(new { message = "المستخدم مش أدمن" });

            user.IsAdmin = false;
            await _userManager.UpdateAsync(user);

            return Ok(new { message = $"{user.FullName} لم يعد أدمن" });
        }
    }
}