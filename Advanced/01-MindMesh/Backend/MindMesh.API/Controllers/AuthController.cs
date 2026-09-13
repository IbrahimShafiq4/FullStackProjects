using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MindMesh.Application.Features.Auth;
using MindMesh.Application.Interfaces;
using MindMesh.Domain.Entities;
using System.Security.Claims;

namespace MindMesh.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IStatsService _statsService;

        public AuthController
        (
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IStatsService statsService
        )
        {
            _userManager    = userManager;
            _signInManager  = signInManager;
            _tokenService   = tokenService;
            _statsService   = statsService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);

            if (existingUser is not null)
                return BadRequest(new { message = "البريد الإلكتروني مستخدم بالفعل" });

            var user = new AppUser
            {
                FullName = request.FullName,
                Email = request.Email,
                UserName = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    errors = result.Errors.Select(e => e.Description)
                });
            }

            var token = await _tokenService.CreateTokenAsync(user);

            SetAuthCookie(token);

            return Ok(new AuthResponse(
                user.Id,
                user.FullName,
                user.Email!
            ));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user is null)
                return Unauthorized(new { message = "البريد الإلكتروني أو كلمة المرور غير صحيحة" });

            var result = await _signInManager.CheckPasswordSignInAsync(
                user,
                request.Password,
                false
            );

            if (!result.Succeeded)
                return Unauthorized(new { message = "البريد الإلكتروني أو كلمة المرور غير صحيحة" });

            var token = await _tokenService.CreateTokenAsync(user);

            SetAuthCookie(token);

            return Ok(new AuthResponse(
                user.Id,
                user.FullName,
                user.Email!
            ));
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);

            if (user is null)
                return Unauthorized();

            return Ok(new AuthResponse
            (
                user.Id,
                user.FullName,
                user.Email!
            ));
        }

        [Authorize]
        [HttpGet("me/details")]
        public async Task<IActionResult> GetMeDetails()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null) return Unauthorized();

            var details = await _statsService.GetUserDetailsAsync(userId);
            if (details is null) return NotFound();

            return Ok(details);
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("authToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            return Ok(new { message = "تم تسجيل الخروج" });
        }

        private void SetAuthCookie(string token)
        {
            Response.Cookies.Append("authToken", token, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });
        }
    }
}
