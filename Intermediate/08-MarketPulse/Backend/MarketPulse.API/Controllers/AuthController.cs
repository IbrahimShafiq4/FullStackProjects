using MarketPulse.API.DTOs;
using MarketPulse.API.Models;
using MarketPulse.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace MarketPulse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _users;
        private readonly SignInManager<AppUser> _signIn;
        private readonly ITokenService _tokens;
        private readonly IAuditService _audit;

        public AuthController(
            UserManager<AppUser> users,
            SignInManager<AppUser> signIn,
            ITokenService tokens,
            IAuditService audit)
        {
            _users = users;
            _signIn = signIn;
            _tokens = tokens;
            _audit = audit;
        }

        private CookieOptions AuthCookieOptions() => new()
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/",
            Expires = DateTimeOffset.UtcNow.AddDays(1),
            IsEssential = true
        };

        [HttpPost("register")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var existing = await _users.FindByEmailAsync(dto.Email);
            if (existing is not null)
                return Ok(new { message = "إذا كان البريد صالحًا، سيتم إنشاء الحساب." });

            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName.Trim()
            };

            var result = await _users.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

            await _audit.LogAsync(user.Id, "register", HttpContext.Connection.RemoteIpAddress?.ToString());

            return Ok(new { message = "تم إنشاء الحساب، يمكنك تسجيل الدخول الآن." });
        }

        [HttpPost("login")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var user = await _users.FindByEmailAsync(dto.Email);
            if (user is null)
            {
                await _audit.LogAsync(null, "login_fail_unknown",
                    HttpContext.Connection.RemoteIpAddress?.ToString());
                return Unauthorized(new { message = "بيانات الدخول غير صحيحة." });
            }

            var result = await _signIn.CheckPasswordSignInAsync(user, dto.Password, lockoutOnFailure: true);

            if (result.IsLockedOut)
            {
                await _audit.LogAsync(user.Id, "login_locked",
                    HttpContext.Connection.RemoteIpAddress?.ToString());
                return Unauthorized(new { message = "الحساب مقفل مؤقتًا. حاول لاحقًا." });
            }

            if (!result.Succeeded)
            {
                await _audit.LogAsync(user.Id, "login_fail",
                    HttpContext.Connection.RemoteIpAddress?.ToString());
                return Unauthorized(new { message = "بيانات الدخول غير صحيحة." });
            }

            var token = _tokens.CreateToken(user);

            Response.Cookies.Append("authToken", token, AuthCookieOptions());

            await _audit.LogAsync(user.Id, "login_ok",
                HttpContext.Connection.RemoteIpAddress?.ToString());

            return Ok(new
            {
                message = "تم تسجيل الدخول بنجاح",
                fullName = user.FullName,
                userId = user.Id,
                avatarUrl = user.AvatarUrl
            });
        }

        [HttpPost("logout")]
        [AllowAnonymous]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            Response.Cookies.Delete("authToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            });

            if (userId is not null)
                await _audit.LogAsync(userId, "logout",
                    HttpContext.Connection.RemoteIpAddress?.ToString());

            return Ok(new { message = "تم تسجيل الخروج بنجاح" });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null) return Unauthorized();

            var user = await _users.FindByIdAsync(userId);
            if (user is null) return Unauthorized();

            return Ok(new
            {
                userId = user.Id,
                fullName = user.FullName,
                email = user.Email,
                avatarUrl = user.AvatarUrl
            });
        }
    }
}