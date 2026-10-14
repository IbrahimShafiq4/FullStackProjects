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
    public class UserSettingsController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public UserSettingsController(IAppDbContext context)
        { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("my")]
        public async Task<IActionResult> GetMySettings()
        {
            var settings = await _context.UserSettings
                .FirstOrDefaultAsync(s => s.UserId == GetCurrentUserId());

            if (settings is null)
                return Ok(
                    new 
                    { 
                        isPrivateAccount = false, 
                        emailNotifications = true, 
                        pushNotifications = true, 
                        preferredLanguage = "ar" 
                    }
                );

            return Ok(new
            {
                settings.IsPrivateAccount,
                settings.EmailNotifications,
                settings.PushNotifications,
                settings.PreferredLanguage
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var settings = await _context.UserSettings.FindAsync(id);

            return settings is null ? NotFound() :
                Ok(new
                {
                    settings.Id,
                    settings.IsPrivateAccount,
                    settings.EmailNotifications,
                    settings.PushNotifications,
                    settings.PreferredLanguage
                });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] bool isPrivateAccount, [FromForm] bool emailNotifications, [FromForm] bool pushNotifications, [FromForm] string preferredLanguage)
        {
            var settings = new UserSettings
            {
                IsPrivateAccount = isPrivateAccount,
                EmailNotifications = emailNotifications,
                PushNotifications = pushNotifications,
                PreferredLanguage = preferredLanguage,
                UserId = GetCurrentUserId()
            };

            _context.UserSettings.Add(settings);
            await _context.SaveChangesAsync();

            return Ok(new { settings.Id });
        }

        [HttpPut("my")]
        public async Task<IActionResult> UpdateMy([FromForm] bool isPrivateAccount, [FromForm] bool emailNotifications, [FromForm] bool pushNotifications, [FromForm] string preferredLanguage)
        {
            var userId = GetCurrentUserId();
            var settings = await _context.UserSettings
                            .FirstOrDefaultAsync(us => us.UserId == userId);
            if (settings is null)
            {
                settings = new UserSettings { UserId = userId };
                _context.UserSettings.Add(settings);
            }

            settings.IsPrivateAccount   = isPrivateAccount;
            settings.EmailNotifications = emailNotifications;
            settings.PushNotifications  = pushNotifications;
            settings.PreferredLanguage  = preferredLanguage;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var settings = await _context.UserSettings.FindAsync(id);
            if (settings is null) 
                return NotFound();

            if (settings.UserId != GetCurrentUserId()) 
                return Forbid();

            _context.UserSettings.Remove(settings);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
