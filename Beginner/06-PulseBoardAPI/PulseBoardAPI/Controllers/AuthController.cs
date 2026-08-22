using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PulseBoardAPI.DTOs.Auth;
using PulseBoardAPI.Models;
using PulseBoardAPI.Services;

namespace PulseBoardAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser>   _UserManager;
        private readonly SignInManager<AppUser> _SignInManager;
        private readonly TokenService           _tokenService;

        public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService)
        { _UserManager = userManager; _SignInManager = signInManager; _tokenService = tokenService; }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName
            };

            var result = await _UserManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded) { return BadRequest(result.Errors.Select(e => e.Description)); }

            return Ok(new { Message = "تم إنشاء الحساب بنجاح" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _UserManager.FindByEmailAsync(dto.Email);

            if (user is null) { return Unauthorized("بيانات الدخول غير صحيحة"); }

            var result = await _SignInManager.CheckPasswordSignInAsync(user, dto.Password, false);

            if (!result.Succeeded) { return Unauthorized("بيانات الدخول غير صحيحة"); }

            var token = _tokenService.CreateToken(user);

            Response.Cookies.Append("authToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(1)
            });

            return Ok(new { Message = "تم تسجيل الدخول بنجاح", fullName = user.FullName });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("authToken");
            return Ok(new { Message = "تم تسجيل الخروج بنجاح" });
        }
    }
}
