using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSwapAPI.Api.Data;
using SkillSwapAPI.Api.DTOs;

namespace SkillSwapAPI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppUsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly DbSet<AppUser> _appUser;
        private readonly IWebHostEnvironment _env;
        private readonly IMapper _mapper;

        public AppUsersController(AppDbContext context, IWebHostEnvironment env, IMapper mapper)
        { _context = context; _env = env; _mapper = mapper; _appUser = _context.Set<AppUser>(); }

        // POST: /api/AppUsers/{userId}/upload-image
        // رفع صورة Profile لمستخدم معين
        [HttpPost("{userId}/upload-image")]
        public async Task<IActionResult> UploadProfileImage(
            int userId,
            IFormFile file)
        {
            // نتأكد إن المستخدم موجود
            var user = await _appUser.FindAsync(userId);

            if (user is null)
                return NotFound(new
                {
                    message = "User not found."
                });

            // نتأكد إن الملف موجود
            if (file is null || file.Length == 0)
                return BadRequest(new
                {
                    message = "Please select an image."
                });

            // أنواع الصور المسموح بها
            var allowedExtensions = new[]
            {
        ".jpg",
        ".jpeg",
        ".png",
        ".gif"
    };

            // أقصى حجم = 20 MB
            const long maxFileSize = 20 * 1024 * 1024;

            if (file.Length > maxFileSize)
            {
                return BadRequest(new
                {
                    message = "File size cannot exceed 20 MB."
                });
            }

            var extension = Path
                .GetExtension(file.FileName)
                .ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new
                {
                    message = "Only JPG, JPEG, PNG and GIF files are allowed."
                });
            }

            // حفظ الصورة
            var imageUrl = await SaveFileAsync(file, extension);

            // حفظ الرابط في DB
            user.ProfilePicture = imageUrl;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Profile image uploaded successfully.",
                imageUrl = user.ProfilePicture
            });
        }

        // POST: /api/AppUsers
        [HttpPost]
        public async Task<ActionResult<AppUserDto>> CreateUser(CreateAppUserDto dto)
        {
            var user = _mapper.Map<AppUser>(dto);
            _appUser.Add(user);
            await _context.SaveChangesAsync();

            var resultDto = _mapper.Map<AppUserDto>(user);

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, resultDto);
        }

        // GET: /api/AppUsers/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUserDto>> GetById(int id)
        {
            var user = await _appUser.FindAsync(id);

            if (user is null) { return NotFound(); }

            var userDto = _mapper.Map<AppUserDto>(user);

            return Ok(userDto);
        }

        [HttpGet]
        public async Task<ActionResult<AppUserDto>> GetAllAsync() 
        {
            var users = await _appUser.Include(u => u.UserSkills).ToListAsync();
            var userDtos = _mapper.Map<List<AppUserDto>>(users);
            return Ok(userDtos);
        }

        private async Task<string> SaveFileAsync(
            IFormFile file,
            string extension)
        {
            // اسم جديد للصورة علشان نضمن عدم حدوث conflicts
            var fileName = $"{Guid.NewGuid()}{extension}";

            // wwwroot/uploads/profiles
            var uploadsFolder = Path.Combine(
                _env.WebRootPath!,
                "uploads",
                "profiles"
            );

            // إنشاء الفولدر لو مش موجود
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // المسار الكامل للصورة
            var filePath = Path.Combine(
                uploadsFolder,
                fileName
            );

            // حفظ الصورة
            await using var fileStream = new FileStream(
                filePath,
                FileMode.Create
            );

            await file.CopyToAsync(fileStream);

            // الرابط الذي سنخزنه في Database
            return $"/uploads/profiles/{fileName}";
        }
    
        
    }
}
