using GigLink.Application.DTOs.Auth;
using GigLink.Application.Interfaces;
using GigLink.Domain.Entities;
using GigLink.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GigLink.API.NewFolder
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser>   _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService          _tokenService;

        private string userName = string.Empty;

        public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService)
        { _userManager = userManager; _signInManager = signInManager; _tokenService = tokenService; }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (!Enum.TryParse<UserRole>(dto.Role, true, out var role))
            {
                return BadRequest("الدور غير صحيح، لازم يكون Client أو Freelancer.");
            }

            var user = new AppUser
            {
                UserName    = dto.Email,
                FullName    = dto.FullName,
                Email       = dto.Email,
                Role        = role
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.Select(e => e.Description));
            }

            return Ok(new { message = "تم إنشاء الحساب بنجاح" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user is null) { return Unauthorized("بيانات الدخول غير صحيحة"); }

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded) { return Unauthorized("بيانات الدخول غير صحيحة"); }

            var token = _tokenService.CreateToken(user);

            Response.Cookies.Append("authToken",token , new CookieOptions
            {
                Secure      = true,
                SameSite    = SameSiteMode.None,
                Expires     = DateTime.UtcNow.AddDays(1),
                HttpOnly    = true,
            });

            userName = user.FullName;

            return Ok(new { message = "تم تسجيل الدخول بنجاح", fullName = user.FullName, role = user.Role.ToString(), id = user.Id });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("authToken");
            return Ok(new { message = $"عد مرة اخرى يا {userName}" });
        }
    }
}
