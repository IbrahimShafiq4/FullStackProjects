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
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return Unauthorized("بيانات الدخول غير صحيحة");

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded) return Unauthorized("بيانات الدخول غير صحيحة");

            var token = _tokenService.CreateToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            SetCookies(token, refreshToken);

            return Ok(new { message = "تم تسجيل الدخول", fullName = user.FullName });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken)) return Unauthorized();

            var userId = _tokenService.ValidateRefreshToken(refreshToken);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Unauthorized();

            var newToken = _tokenService.CreateToken(user);
            var newRefresh = _tokenService.GenerateRefreshToken();

            SetCookies(newToken, newRefresh);

            return Ok(new { token = newToken });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("authToken");
            Response.Cookies.Delete("refreshToken");
            return Ok(new { message = "تم تسجيل الخروج" });
        }

        private void SetCookies(string token, string refreshToken)
        {
            Response.Cookies.Append("authToken", token, new CookieOptions
            {
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(1),
                HttpOnly = true,
                Secure = true
            });

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(30),
                HttpOnly = true,
                Secure = true
            });
        }
    }
}
