using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StreamVault.API.Services;
using StreamVault.Application.Features;
using StreamVault.Domain.Domain;
using System.Security.Claims;

namespace StreamVault.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<Instructor> _userManager;
        private readonly SignInManager<Instructor> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _config;

        public AuthController(
            UserManager<Instructor> userManager,
            SignInManager<Instructor> signInManager,
            ITokenService tokenService,
            IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            return await CreateUserInternal(dto.FullName, dto.Email, dto.Password, "Student");
        }

        [HttpPost("register-teacher")]
        public async Task<IActionResult> RegisterTeacher(RegisterTeacherDto dto)
        {
            var expected = _config["TeacherInviteCode"];
            if (string.IsNullOrWhiteSpace(expected) || dto.InviteCode != expected)
                return Forbid();

            return await CreateUserInternal(dto.FullName, dto.Email, dto.Password, "Instructor");
        }

        private async Task<IActionResult> CreateUserInternal(string fullName, string email, string password, string role)
        {
            var userExisted = await _userManager.FindByEmailAsync(email);
            if (userExisted is not null)
                return Conflict(new { message = "هذا البريد الإلكتروني مستخدم بالفعل" });

            var user = new Instructor
            {
                FullName = fullName,
                Email = email,
                UserName = email
            };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
                return BadRequest(new { message = "فشل إنشاء الحساب", errors = result.Errors.Select(e => e.Description) });

            var claimResult = await _userManager.AddClaimAsync(user, new Claim(ClaimTypes.Role, role));
            if (!claimResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                return BadRequest(new { message = "فشل إعداد صلاحيات الحساب", errors = claimResult.Errors.Select(e => e.Description) });
            }

            return StatusCode(StatusCodes.Status201Created, new { message = "تم إنشاء الحساب بنجاح" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user is null)
                return Unauthorized(new { message = "بيانات الدخول غير صحيحة" });

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, true);

            if (result.IsLockedOut)
                return Unauthorized(new { message = "تم إيقاف الحساب مؤقتًا بسبب محاولات تسجيل دخول متكررة" });

            if (!result.Succeeded)
                return Unauthorized(new { message = "بيانات الدخول غير صحيحة" });

            var claims = await _userManager.GetClaimsAsync(user);
            var role = claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            if (string.IsNullOrWhiteSpace(role))
                return Unauthorized(new { message = "الحساب لا يحتوي على صلاحية صالحة" });

            var token = _tokenService.CreateToken(user, role);

            Response.Cookies.Append("authToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddDays(1)
            });

            return Ok(new { message = "تم الدخول بنجاح", fullName = user.FullName, role });
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var name = User.FindFirstValue(ClaimTypes.Name);
            var email = User.FindFirstValue(ClaimTypes.Email);
            var role = User.FindFirstValue(ClaimTypes.Role);

            return Ok(new CurrentUserDto(id ?? string.Empty, name ?? string.Empty, email ?? string.Empty, role ?? string.Empty));
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("authToken", new CookieOptions
            {
                Path = "/",
                Secure = true,
                SameSite = SameSiteMode.None
            });

            return Ok(new { message = "تم تسجيل الخروج بنجاح" });
        }
    }
}