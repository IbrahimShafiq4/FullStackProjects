using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SignalDesk.BLL.DTOs.Profile;
using SignalDesk.BLL.Services;
using System.Security.Claims;

namespace SignalDesk.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException();

        private string GetCurrentRole() =>
            User.FindFirstValue(ClaimTypes.Role) ?? "Customer";

        [HttpGet]
        public async Task<ActionResult<ProfileDto>> Get()
        {
            var profile = await _profileService.GetAsync(GetCurrentUserId(), GetCurrentRole());
            if (profile == null) return NotFound();
            return Ok(profile);
        }

        [HttpPut]
        public async Task<ActionResult<ProfileDto>> Update(UpdateProfileDto dto)
        {
            var profile = await _profileService.UpdateAsync(GetCurrentUserId(), GetCurrentRole(), dto);
            if (profile == null) return NotFound();
            return Ok(profile);
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var ok = await _profileService.ChangePasswordAsync(GetCurrentUserId(), dto);
            if (!ok) return BadRequest(new { message = "كلمة المرور الحالية غير صحيحة" });
            return Ok(new { message = "تم تغيير كلمة المرور" });
        }
    }
}