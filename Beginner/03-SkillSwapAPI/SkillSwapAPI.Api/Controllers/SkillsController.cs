using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSwapAPI.Api.Data;
using SkillSwapAPI.Api.DTOs;

namespace SkillSwapAPI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SkillsController : ControllerBase
    {
        private readonly AppDbContext   _context;
        private readonly IMapper        _mapper;
        private readonly DbSet<Skill>   _dbSet;

        public SkillsController(AppDbContext context, IMapper mapper)
        { _context = context; _mapper = mapper; _dbSet = _context.Set<Skill>(); }

        // --- علشان نجيب كل المهارات من ال DB --- //
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SkillDto>>> GetAllSkills()
        {
            var skills = await _dbSet.ToListAsync();
            var dtos = _mapper.Map<List<SkillDto>>(skills);
            return Ok(dtos);
        }

        // --- علشان نضيف مهارة جديدة لل DB --- //
        [HttpPost]
        public async Task<ActionResult<SkillDto>> CreateSkill(CreateSkillDto createDto)
        {
            if (createDto == null || !ModelState.IsValid) { return BadRequest(); }

            var skill = _mapper.Map<Skill>(createDto);

            await _dbSet.AddAsync(skill);
            await _context.SaveChangesAsync();

            var dto = _mapper.Map<SkillDto>(skill);

            return CreatedAtAction(nameof(GetSkillById), new { id = skill.Id }, dto);
        }

        // --- علشان نجيب مهارة معينة بال ID بتاعها --- //
        [HttpGet("{id}")]
        public async Task<ActionResult<SkillDto>> GetSkillById(int id)
        {
            var skill = await _context.Skills.FindAsync(id);
            if (skill == null) return NotFound();

            return Ok(_mapper.Map<SkillDto>(skill));
        }
    }
}
