using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MomentoAPI.DTOs.Auth;
using MomentoAPI.Models;
using MomentoAPI.Services;
using System.Runtime.CompilerServices;

namespace MomentoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser>   _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService           _tokenService;

        public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> SignInManager, TokenService tokenService)
        { _userManager = userManager; _signInManager = SignInManager; _tokenService = tokenService; }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = new AppUser
            {
                UserName    = dto.Email,
                Email       = dto.Email,
                FullName    = dto.FullName
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded) { return BadRequest(result.Errors.Select(e => e.Description)); }

            return Ok(new { message = "تم إنشاء الحساب بنجاح" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return Unauthorized("بيانات الدخول غير صحيحة");

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded) return Unauthorized("بيانات الدخول غير صحيحة");

            var token = _tokenService.CreateToken(user);

            Response.Cookies.Append("authToken", token, new CookieOptions
            {
                HttpOnly    = true,
                SameSite    = SameSiteMode.None,
                Secure      = true,
                Expires     = DateTime.UtcNow.AddDays(1)
            });

            return Ok(new { message = "تم تسجيل الدخول بنجاح", fullName = user.FullName });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("authToken");
            return Ok(new { message = "تم تسجيل الخروج بنجاح" });
        }
    }
}
