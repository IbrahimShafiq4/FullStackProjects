using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamVault.Application.Features;
using StreamVault.Application.Interfaces;
using StreamVault.Domain.Domain;
using System.Security.Claims;

namespace StreamVault.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CoursesController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public CoursesController(IAppDbContext context)
        {
            _context = context;
        }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetCourses(CancellationToken cancellationToken)
        {
            var courses = await _context.Courses
                .AsNoTracking()
                .OrderBy(c => c.ClassroomNumber)
                .Select(c => new CourseDto(
                    c.Id,
                    c.Title,
                    c.Description,
                    c.Instructor.FullName,
                    c.Videos.Count,
                    c.ClassroomNumber,
                    c.Status,
                    c.FloorId))
                .ToListAsync(cancellationToken);

            return Ok(courses);
        }

        [HttpPost]
        [Authorize(Roles = "Instructor")]
        public async Task<ActionResult> CreateCourse(CreateCourseDto dto, CancellationToken cancellationToken)
        {
            var floor = await _context.Floors.FindAsync(new object[] { dto.FloorId }, cancellationToken);
            if (floor is null)
                return BadRequest(new { message = "الأرضية غير موجودة" });

            var course = new Course
            {
                Title = dto.Title,
                Description = dto.Description,
                InstructorId = CurrentUserId,
                FloorId = dto.FloorId,
                ClassroomNumber = dto.ClassroomNumber,
                Status = "study"
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetCourse), new { courseId = course.Id }, new { course.Id });
        }

        [HttpGet("{courseId:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<CourseDto>> GetCourse(int courseId, CancellationToken cancellationToken)
        {
            var course = await _context.Courses
                .AsNoTracking()
                .Where(c => c.Id == courseId)
                .Select(c => new CourseDto(
                    c.Id,
                    c.Title,
                    c.Description,
                    c.Instructor.FullName,
                    c.Videos.Count,
                    c.ClassroomNumber,
                    c.Status,
                    c.FloorId))
                .FirstOrDefaultAsync(cancellationToken);

            if (course is null)
                return NotFound(new { message = "الكورس غير متاح حاليا" });

            return Ok(course);
        }

        [HttpGet("floor/{floorId:int}")]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetCoursesByFloor(int floorId, CancellationToken cancellationToken)
        {
            var courses = await _context.Courses
                .AsNoTracking()
                .Where(c => c.FloorId == floorId)
                .OrderBy(c => c.ClassroomNumber)
                .Select(c => new CourseDto(
                    c.Id,
                    c.Title,
                    c.Description,
                    c.Instructor.FullName,
                    c.Videos.Count,
                    c.ClassroomNumber,
                    c.Status,
                    c.FloorId))
                .ToListAsync(cancellationToken);

            return Ok(courses);
        }

        [HttpPut("{courseId:int}")]
        [Authorize(Roles = "Instructor")]
        public async Task<ActionResult> UpdateCourse(int courseId, UpdateCourseDto dto, CancellationToken cancellationToken)
        {
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == courseId && c.InstructorId == CurrentUserId, cancellationToken);

            if (course is null)
                return NotFound(new { message = "الكورس غير متاح حاليا" });

            course.Title = dto.Title;
            course.Description = dto.Description;

            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { message = "تم تعديل الكورس بنجاح" });
        }

        [HttpDelete("{courseId:int}")]
        [Authorize(Roles = "Instructor")]
        public async Task<ActionResult> DeleteCourse(int courseId, CancellationToken cancellationToken)
        {
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == courseId && c.InstructorId == CurrentUserId, cancellationToken);

            if (course is null)
                return NotFound(new { message = "الكورس غير متاح حاليا" });

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { message = "تم حذف الكورس بنجاح" });
        }
    }
}