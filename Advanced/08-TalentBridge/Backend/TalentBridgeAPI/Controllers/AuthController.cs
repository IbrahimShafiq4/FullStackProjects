using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentBridgeAPI.DTOs;
using TalentBridgeAPI.Models;
using TalentBridgeAPI.Services;

namespace TalentBridgeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser>   _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService          _tokenService;

        public AuthController
            (
                UserManager<AppUser>    userManager,
                SignInManager<AppUser>  signInManager,
                ITokenService           tokenService
            )
        {
            _userManager    = userManager;
            _signInManager  = signInManager;
            _tokenService   = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var userExisted = await _userManager.FindByEmailAsync(dto.Email);
            if (userExisted is not null)
                return Conflict(new { message = "هذا الإيميل مستخدم بالفعل" });

            if (!Enum.TryParse<UserRole>(dto.Role, true, out var role))
                return BadRequest(new { message = "لا يوجد دور بتلك المواصفات" });

            var user = new AppUser
            {
                Email       = dto.Email,
                Role        = role,
                FullName    = dto.FullName,
                UserName    = dto.Email
            };
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors.Select(e => e.Description));
            return Ok(new { message = "تم إنشاء الحساب بنجاح" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user is null)
                return Unauthorized(new { message = "بيانات التسجيل غير صحيحة" });

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, true);
            if (!result.Succeeded)
                return Unauthorized(new { Message = "بيانات التسجيل غير واضحة" });

            var token = _tokenService.CreateToken(user);
            Response.Cookies.Append("authToken", token, new CookieOptions
            {
                Secure      = true,
                SameSite    = SameSiteMode.None,
                Expires     = DateTime.UtcNow.AddDays(1),
                HttpOnly    = true
            });

            return Ok(new { message = "تم تسجيل الدخول بنجاح", fullName = user.FullName, role = user.Role.ToString() });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user is null)
                return Unauthorized();

            return Ok(new
            {
                id          = user.Id,
                fullName    = user.FullName,
                role        = user.Role.ToString(),
                email       = user.Email,
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("authToken");
            return Ok(new { message = "تم تسجيل الخروج بنجاح" });
        }
    }
}
