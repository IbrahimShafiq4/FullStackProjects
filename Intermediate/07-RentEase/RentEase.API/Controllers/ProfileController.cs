using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentEase.API.DTOs;
using RentEase.API.Services;
using System.Security.Claims;

namespace RentEase.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        public ProfileController(IProfileService profileService) { _profileService = profileService; }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var profile = await _profileService.GetAsync(GetUserId());
            return profile is null ? NotFound() : Ok(profile);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateProfileDto dto)
        {
            var (success, error) = await _profileService.UpdateAsync(GetUserId(), dto);
            return success ? Ok(new { message = "تم تحديث البيانات" }) : BadRequest(error);
        }

        [HttpPut("password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var (success, errors) = await _profileService.ChangePasswordAsync(GetUserId(), dto);
            return success ? Ok(new { message = "تم تغيير كلمة المرور" }) : BadRequest(errors);
        }
    }
}