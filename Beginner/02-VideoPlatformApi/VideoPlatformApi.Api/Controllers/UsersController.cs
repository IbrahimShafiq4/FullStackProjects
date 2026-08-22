using Microsoft.AspNetCore.Mvc;
using VideoPlatformApi.Api.DTOs;
using VideoPlatformApi.Api.Services.UserServiceControl;

namespace VideoPlatformApi.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        //private readonly IUserSer _userService;
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // ==========================================
        // GET: api/users
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(new
            {
                Status = "success",
                Data = users,
                Count = users.Count()
            });
        }

        // ==========================================
        // GET: api/users/{id}
        // ==========================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(new { Status = "error", Message = $"المستخدم بـ ID {id} غير موجود" });

            return Ok(new { Status = "success", Data = user });
        }

        // ==========================================
        // POST: api/users
        // ==========================================
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateUserDto createDto)
        {
            try
            {
                var user = await _userService.CreateUserAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = user.Id }, new
                {
                    Status = "success",
                    Message = "تم إنشاء المستخدم بنجاح",
                    Data = user
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Status = "error", Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Status = "error", Message = ex.Message });
            }
        }

        // ==========================================
        // DELETE: api/users/{id}
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return Ok(new
                {
                    Status = "success",
                    Message = $"تم حذف المستخدم بـ ID {id} بنجاح"
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Status = "error", Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Status = "error", Message = ex.Message });
            }
        }
    }
}
