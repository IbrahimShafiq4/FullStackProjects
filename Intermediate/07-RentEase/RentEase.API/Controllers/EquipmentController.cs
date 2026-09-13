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
        private readonly AppDbContext           _context;
        private readonly IEquipmentRepository   _repository;
        private readonly IMediaStorageService   _mediaStorage;

        public EquipmentController(AppDbContext context, IEquipmentRepository equipmentRepository, IMediaStorageService mediaStorageService)
        { _mediaStorage = mediaStorageService; _context = context; _repository = equipmentRepository; }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetEquipment([FromQuery] decimal? maxPrice, string? category)
        {
            var spec = new EquipmentSpecification()
                                .WithMaxPrice(maxPrice)
                                .WithCategory(category)
                                .AvailableOnly();

            var equipment = await _context.Equipments.Include(e => e.Owner).Where(spec.Criteria)
                .Select(e => new EquipmentDto { Id = e.Id, Name = e.Name, Category = e.Category, PricePerDay = e.PricePerDay, IsAvailable = e.IsAvailable, ImageUrl = e.ImageUrl, OwnerName = e.Owner.FullName })
                .ToListAsync();

            return Ok(equipment);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetails(int id)
        {
            var e = await _context.Equipments.Include(e => e.Owner)
                                                     .FirstOrDefaultAsync(e => e.Id == id);
            if (e is null) return NotFound();
            return Ok(new EquipmentDto { Id = e.Id, Name = e.Name, Category = e.Category, PricePerDay = e.PricePerDay, IsAvailable = e.IsAvailable, ImageUrl = e.ImageUrl, OwnerName = e.Owner.FullName });
        }

        [HttpPost]
        public async Task<IActionResult> CreateEquipment([FromForm] CreateEquipmentDto dto, IFormFile? photo)
        {
            string? imageUrl = null;
            if (photo != null && photo.Length > 0)
            {
                try
                {
                    imageUrl = await _mediaStorage.SaveAsync(photo);
                }
                catch(InvalidOperationException ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            var equipment = new Equipment
            {
                Name        = dto.Name,
                Category    = dto.Category,
                PricePerDay = dto.PricePerDay,
                ImageUrl    = imageUrl,
                OwnerId     = GetCurrentUserId(),
            };

            await _repository.AddAsync(equipment);
            await _context.SaveChangesAsync();

            return Ok(new { name = equipment.Name, category = equipment.Category, pricePerDay = equipment.PricePerDay, imageUrl = equipment.ImageUrl, ownerId = equipment.OwnerId });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            var equipment = await _repository.GetByIdAsync(id);
            if (equipment is null) { return NotFound(); }

            var equipmentName = equipment.Name;

            if (equipment.OwnerId != GetCurrentUserId()) return Forbid();
            _repository.Remove(equipment);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"تم حذف {equipmentName} بنجاح" });
        }
    }
}
