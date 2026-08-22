using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSwapAPI.Api.Data;
using SkillSwapAPI.Api.DTOs;

namespace SkillSwapAPI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserSkillsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly DbSet<UserSkill> _userSkills;
        private readonly IMapper _mapper;

        public UserSkillsController(AppDbContext context, IMapper mapper)
        { _context = context; _userSkills = _context.Set<UserSkill>(); _mapper = mapper; }

        // POST: /api/UserSkills
        // علشان نضيف مهارة لمستخدم معين
        [HttpPost]
        public async Task<ActionResult<UserSkillDto>> AddSkillToUser(AddUserSkillDto dto)
        {
            var userExists = await _context.AppUsers.AnyAsync(u => u.Id == dto.AppUserId);

            var skillExists = await _context.Skills.AnyAsync(s => s.Id == dto.SkillId);

            var alreadyExists = await _userSkills.AnyAsync(us => us.AppUserId == dto.AppUserId && us.SkillId == dto.SkillId);

            if (alreadyExists) return BadRequest("This user is Already has this skill Added.");

            var userSkill = new UserSkill
            {
                AppUserId = dto.AppUserId,
                SkillId = dto.SkillId,
                Level = dto.Level,
                AquiredAt = DateTime.UtcNow
            };

            await _userSkills.AddAsync(userSkill);
            await _context.SaveChangesAsync();

            await _context.Entry(userSkill).Reference(us => us.Skill).LoadAsync();

            var resultDto = _mapper.Map<UserSkillDto>(userSkill);
            return Ok(resultDto);
        }

        // GET: /api/UserSkills/user/{userId}
        // علشان نجيب مهارات شخص معين
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<UserSkillDto>>> GetSkillsForUser(int userId)
        {
            var userSkills = await _userSkills.Include(us => us.Skill)
                                              .Where(us => us.AppUserId == userId)
                                              .ToListAsync();

            var resultDto = _mapper.Map<IEnumerable<UserSkillDto>>(userSkills);
            return Ok(resultDto);
        }

        // GET: /api/UserSkills/skill/{skillId}?level=Intermediate
        // علشان نجيب كل الأشخاص اللى عندهم مهارة معينة وهنستخدم معاه [FromQuery] علشان نعمل filteration;
        [HttpGet("skill/{skillId}")]
        public async Task<ActionResult<string>> GetUsersForSkill(int skillId, [FromQuery] SkillLevel? level)
        {
            var query = _userSkills.Include(us => us.AppUser)
                                   .Where(us => us.SkillId == skillId);

            if (level.HasValue)
            {
                query = query.Where(us => us.Level == level.Value);
            }

            var userNames = await query.Select(us => us.AppUser.FullName).ToListAsync();
            return Ok(userNames);
        }
    }
}
