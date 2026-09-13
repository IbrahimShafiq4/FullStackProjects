using FitTrackPro.API.DTOs;
using FitTrackPro.API.Models;
using FitTrackPro.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FitTrackPro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser>   _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService          _tokenService;

        public AuthController(
            UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager, 
            ITokenService tokenService
        )
        { 
            _userManager    = userManager; 
            _signInManager  = signInManager; 
            _tokenService   = tokenService; 
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (!Enum.TryParse<UserRole>(dto.Role, true, out var role))
                return BadRequest("ال role غير صحيح لازم يكون Coach, Trainee");

            var user = new AppUser
            {
                Email = dto.Email,
                UserName = dto.Email,
                FullName = dto.FullName,
                Role = role
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(er => er.Description));

            return Ok(new { message = "تم إنشاء الحساب بنجاح" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if(user is null) { return Unauthorized("بيانات الدخول غير صحيحة"); }

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded) { return Unauthorized("بيانات الدخول غير صحيحة"); }

            var token = _tokenService.CreateToken(user);

            Response.Cookies.Append("authToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(1)
            });

            return Ok(new { message = "تم تسيجيل الدخول بنجاح", fullName = user.FullName, role = user.Role.ToString() });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("authToken");
            return Ok(new { message = "تم تسجيل الخروج بنجاح" });
        }
    }
}
