using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamVault.Application.Interfaces;

namespace StreamVault.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FloorsController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public FloorsController(IAppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetFloors(CancellationToken cancellationToken)
        {
            var floors = await _context.Floors
                .AsNoTracking()
                .OrderBy(f => f.Number)
                .Select(f => new
                {
                    f.Id,
                    f.Number,
                    f.Name,
                    f.Description,
                    classroomCount = f.Classrooms.Count
                })
                .ToListAsync(cancellationToken);

            return Ok(floors);
        }

        [HttpGet("{floorId:int}")]
        public async Task<IActionResult> GetFloor(int floorId, CancellationToken cancellationToken)
        {
            var floor = await _context.Floors
                .AsNoTracking()
                .Where(f => f.Id == floorId)
                .Select(f => new
                {
                    f.Id,
                    f.Number,
                    f.Name,
                    f.Description,
                    classrooms = f.Classrooms
                        .OrderBy(c => c.ClassroomNumber)
                        .Select(c => new
                        {
                            c.Id,
                            c.Title,
                            c.Description,
                            c.ClassroomNumber,
                            c.Status,
                            instructorName = c.Instructor.FullName,
                            videoCount = c.Videos.Count
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (floor is null)
                return NotFound(new { message = "الأرضية غير موجودة" });

            return Ok(floor);
        }
    }
}