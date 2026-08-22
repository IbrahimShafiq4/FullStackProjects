using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SoundVaultAPI.DTOs.Auth;
using SoundVaultAPI.Models;
using SoundVaultAPI.Services;

namespace SoundVaultAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager    <AppUser>   _userManager;
        private readonly SignInManager  <AppUser>   _signInManager;
        private readonly TokenService               _tokenService;

        public AuthController(
            UserManager     <AppUser>   userManager, 
            SignInManager   <AppUser>   signInManager, 
            TokenService                tokenService)
        { _userManager = userManager; _signInManager = signInManager; _tokenService = tokenService; }

        [HttpPost("register")]
        public async Task<IActionResult> register(RegisterDto dto)
        {
            var user = new AppUser
            {
                FullName    = dto.FullName,
                Email       = dto.Email,
                UserName    = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if(!result.Succeeded) { return BadRequest(result.Errors.Select(e => e.Description)); }

            return Ok(new { message = "تم إنشاء الحساب بنجاح" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if(user is null) { return Unauthorized("بيانات الدخول غير صحيحة"); }

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded) { return Unauthorized("بيانات الدخول غير صحيحة"); }

            var token = _tokenService.CreateToken(user);

            Response.Cookies.Append("authToken", token, new CookieOptions
            {
                SameSite    = SameSiteMode.None,
                Expires     = DateTime.UtcNow.AddDays(20),
                HttpOnly    = true,
                Secure      = true,
            });

            return Ok(new { message = "تم تسجيل الدخول بنجاح", fullName = user.FullName });
        }

        [HttpPost("logout")]
        public IActionResult logout()
        {
            Response.Cookies.Delete("authToken");
            return Ok(new { message = "تم تسجيل الخروج بنجاح" });
        }
    }
}
