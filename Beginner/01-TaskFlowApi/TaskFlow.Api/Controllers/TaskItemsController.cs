using Microsoft.AspNetCore.Mvc;
using TaskFlow.Api.DTOs;
using TaskFlow.Api.Models;
using TaskFlow.Api.Repositories;
using TaskFlow.Api.Services;

namespace TaskFlow.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskItemsController : ControllerBase
    {
        private readonly ITaskItemRepository    _taskRepo;
        private readonly IUserStreakRepository  _userStreakRepo;
        private readonly IStreakService         _streakService;

        public TaskItemsController(
            ITaskItemRepository taskRepo,
            IUserStreakRepository userStreakRepo,
            IStreakService streakService)
        {
            _taskRepo = taskRepo;
            _userStreakRepo = userStreakRepo;
            _streakService = streakService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetAll()
        {
            var tasks = await _taskRepo.GetAllAsync();

            var dtos = tasks.Select(t => new TaskItemDto
            {
                Id = t.Id,
                Title = t.Title,
                CreatedAt = t.CreatedAt,
                IsCompleted = t.IsCompleted
            });

            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItemDto>> GetById(int id)
        {
            var task = await _taskRepo.GetByIdAsync(id);

            if (task is null)
                return NotFound();

            var dto = new TaskItemDto
            {
                Id = task.Id,
                Title = task.Title,
                CreatedAt = task.CreatedAt,
                IsCompleted = task.IsCompleted
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<TaskItemDto>> CreateTask(CreateTaskItemDto create)
        {
            var streakExists = await _userStreakRepo.ExistsAsync(create.UserStreakId);
            if (!streakExists)
                return BadRequest($"UserStreak with id {create.UserStreakId} doesn't exist.");

            var newTask = new TaskItem
            {
                Title = create.Title,
                CreatedAt = DateTime.UtcNow,
                IsCompleted = false,
                UserStreakId = create.UserStreakId,
            };

            await _taskRepo.AddAsync(newTask);
            await _taskRepo.SaveChangesAsync();

            var resultDto = new TaskItemDto
            {
                Id = newTask.Id,
                Title = newTask.Title,
                CreatedAt = newTask.CreatedAt,
                IsCompleted = newTask.IsCompleted
            };

            return CreatedAtAction(nameof(GetById), new { id = newTask.Id }, resultDto);
        }

        [HttpPatch("{id}/complete")]
        public async Task<IActionResult> CompleteTask(int id)
        {
            var task = await _taskRepo.GetByIdAsync(id);
            if (task == null)
                return NotFound($"Task with id {id} not found");

            if (task.IsCompleted)
                return BadRequest("Task is already completed");

            task.IsCompleted = true;
            task.CompletedAt = DateTime.UtcNow;

            await _taskRepo.SaveChangesAsync();

            await _streakService.UpdateStreakIfAllTasksCompletedAsync(task.UserStreakId);

            return NoContent();
        }
    }
}