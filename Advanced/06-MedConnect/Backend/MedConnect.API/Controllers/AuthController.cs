using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MedConnect.API.Services;
using MedConnect.Application.Features;
using MedConnect.Application.Interfaces;
using MedConnect.Domain.Entities;
namespace MedConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<Doctor> _userManager;
        private readonly SignInManager<Doctor> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IAppDbContext _context;
        public AuthController(UserManager<Doctor> um, SignInManager<Doctor> sm, ITokenService ts, IAppDbContext context) { _userManager = um; _signInManager = sm; _tokenService = ts; _context = context; }

        [HttpPost("register-doctor")]
        public async Task<IActionResult> RegisterDoctor(RegisterDoctorDto dto)
        {
            var user = new Doctor { UserName = dto.Email, Email = dto.Email, FullName = dto.FullName, Specialty = dto.Specialty };
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors.Select(e => e.Description));
            await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("Role", "Doctor"));
            return Ok(new { message = "تم إنشاء حساب الطبيب بنجاح" });
        }

        [HttpPost("register-patient")]
        public async Task<IActionResult> RegisterPatient(RegisterPatientDto dto)
        {
            var user = new Doctor { UserName = dto.Email, Email = dto.Email, FullName = dto.FullName };
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors.Select(e => e.Description));
            await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("Role", "Patient"));

            _context.Patients.Add(new Patient { FullName = dto.FullName, UserId = user.Id });
            await _context.SaveChangesAsync();
            return Ok(new { message = "تم إنشاء حساب المريض بنجاح" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return Unauthorized("بيانات غير صحيحة");
            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded) return Unauthorized("بيانات غير صحيحة");

            var claims = await _userManager.GetClaimsAsync(user);
            var role = claims.FirstOrDefault(c => c.Type == "Role")?.Value ?? "Patient";
            var token = _tokenService.CreateToken(user, role);

            Response.Cookies.Append("authToken", token, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, Expires = DateTime.UtcNow.AddDays(1) });
            return Ok(new { message = "تم تسجيل الدخول بنجاح", fullName = user.FullName, role, id = user.Id });
        }

        [HttpPost("logout")]
        public IActionResult Logout() { Response.Cookies.Delete("authToken"); return Ok(new { message = "تم تسجيل الخروج" }); }
    }
}