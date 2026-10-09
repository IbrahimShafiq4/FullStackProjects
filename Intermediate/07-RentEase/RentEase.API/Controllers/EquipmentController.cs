using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentEase.API.Data;
using RentEase.API.DTOs;
using RentEase.API.Generics;
using RentEase.API.Models;
using RentEase.API.Services;
using RentEase.API.Specifications;
using System.Security.Claims;

namespace RentEase.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EquipmentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEquipmentRepository _repository;
        private readonly IEquipmentService _equipmentService;
        private readonly IMediaStorageService _mediaStorage;

        public EquipmentController(
            AppDbContext context,
            IEquipmentRepository repository,
            IEquipmentService equipmentService,
            IMediaStorageService mediaStorage)
        {
            _context = context;
            _repository = repository;
            _equipmentService = equipmentService;
            _mediaStorage = mediaStorage;
        }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        // ─────────────────────────────────────────────────────────
        // READ — List with filters
        // ─────────────────────────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> GetEquipment([FromQuery] decimal? maxPrice, [FromQuery] string? category)
        {
            var spec = new EquipmentSpecification()
                                .WithMaxPrice(maxPrice)
                                .WithCategory(category);

            var equipment = await _context.Equipments
                .Include(e => e.Owner)
                .Where(spec.Criteria)
                .Select(e => new EquipmentDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Category = e.Category,
                    PricePerDay = e.PricePerDay,
                    IsAvailable = e.IsAvailable,
                    ImageUrl = e.ImageUrl,
                    OwnerName = e.Owner.FullName
                })
                .ToListAsync();

            return Ok(equipment);
        }

        // ─────────────────────────────────────────────────────────
        // READ — My equipment
        // ─────────────────────────────────────────────────────────
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine()
        {
            var ownerId = GetCurrentUserId();
            var list = await _repository.GetByOwnerAsync(ownerId);

            var result = list.Select(e => new EquipmentDto
            {
                Id = e.Id,
                Name = e.Name,
                Category = e.Category,
                PricePerDay = e.PricePerDay,
                IsAvailable = e.IsAvailable,
                ImageUrl = e.ImageUrl,
                OwnerName = string.Empty
            });

            return Ok(result);
        }

        // ─────────────────────────────────────────────────────────
        // READ — One
        // ─────────────────────────────────────────────────────────
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetails(int id)
        {
            var e = await _repository.GetByIdWithOwnerAsync(id);
            if (e is null) return NotFound();

            return Ok(new EquipmentDto
            {
                Id = e.Id,
                Name = e.Name,
                Category = e.Category,
                PricePerDay = e.PricePerDay,
                IsAvailable = e.IsAvailable,
                ImageUrl = e.ImageUrl,
                OwnerName = e.Owner.FullName
            });
        }

        // ─────────────────────────────────────────────────────────
        // CREATE
        // ─────────────────────────────────────────────────────────
        [HttpPost]
        public async Task<IActionResult> CreateEquipment([FromForm] CreateEquipmentDto dto, IFormFile? photo)
        {
            string? imageUrl = null;
            if (photo != null && photo.Length > 0)
            {
                try { imageUrl = await _mediaStorage.SaveAsync(photo); }
                catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
            }

            var equipment = new Equipment
            {
                Name = dto.Name,
                Category = dto.Category,
                PricePerDay = dto.PricePerDay,
                ImageUrl = imageUrl,
                OwnerId = GetCurrentUserId(),
            };

            await _repository.AddAsync(equipment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = equipment.Id,
                name = equipment.Name,
                category = equipment.Category,
                pricePerDay = equipment.PricePerDay,
                imageUrl = equipment.ImageUrl,
                ownerId = equipment.OwnerId,
                isAvailable = equipment.IsAvailable
            });
        }

        // ─────────────────────────────────────────────────────────
        // UPDATE
        // ─────────────────────────────────────────────────────────
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEquipment(int id, [FromBody] UpdateEquipmentDto dto)
        {
            var (success, error) = await _equipmentService.UpdateAsync(id, GetCurrentUserId(), dto);
            return success ? Ok(new { message = "تم تحديث المعدة" }) : BadRequest(error);
        }

        // ─────────────────────────────────────────────────────────
        // UPDATE — Availability toggle
        // ─────────────────────────────────────────────────────────
        [HttpPatch("{id}/availability")]
        public async Task<IActionResult> SetAvailability(int id, [FromBody] UpdateAvailabilityDto dto)
        {
            var (success, error) = await _equipmentService.SetAvailabilityAsync(id, GetCurrentUserId(), dto.IsAvailable);
            return success ? Ok(new { message = "تم تحديث حالة التوفر" }) : BadRequest(error);
        }

        // ─────────────────────────────────────────────────────────
        // DELETE
        // ─────────────────────────────────────────────────────────
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            var equipment = await _repository.GetByIdAsync(id);
            if (equipment is null) return NotFound();
            if (equipment.OwnerId != GetCurrentUserId()) return Forbid();

            var equipmentName = equipment.Name;
            _repository.Remove(equipment);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"تم حذف {equipmentName} بنجاح" });
        }
    }
}