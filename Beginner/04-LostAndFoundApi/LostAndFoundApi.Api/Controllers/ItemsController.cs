using LostAndFoundApi.Api.Context;
using LostAndFoundApi.Api.DTOs;
using LostAndFoundApi.Api.Hubs;
using LostAndFoundApi.Api.Models;
using LostAndFoundApi.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LostAndFoundApi.Api.Controllers
{
    [ApiController]
    [Route("api/items")]
    public class ItemsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IFileService _fileService;
        private readonly IMatchingService _matchingService;
        private readonly IHubContext<LostAndFoundHub> _hubContext;

        public ItemsController(
            AppDbContext context,
            IFileService fileService,
            IMatchingService matchingService,
            IHubContext<LostAndFoundHub> hubContext)
        {
            _context = context;
            _fileService = fileService;
            _matchingService = matchingService;
            _hubContext = hubContext;
        }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetAll(
            string? search,
            string? category,
            ItemType? type)
        {
            var query = _context.Items
                .Include(i => i.CreatedByUser)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(i =>
                    i.Title.Contains(search) ||
                    i.Description.Contains(search));
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(i => i.Category == category);
            }

            if (type.HasValue)
            {
                query = query.Where(i => i.Type == type.Value);
            }

            var items = await query
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            return Ok(items.Select(MapToDto));
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromForm] CreateItemDto dto,
            IFormFile? image)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return BadRequest(new { message = "العنوان مطلوب" });
            }

            string? imageUrl = null;

            if (image != null)
            {
                try
                {
                    imageUrl = await _fileService.SaveImageAsync(
                        image,
                        "item-images");
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }

            var item = new Item
            {
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                Location = dto.Location,
                Type = dto.Type,
                ImageUrl = imageUrl,
                CreatedByUserId = CurrentUserId
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            var createdItem = await _context.Items
                .Include(i => i.CreatedByUser)
                .FirstAsync(i => i.Id == item.Id);

            return CreatedAtAction(
                nameof(GetById),
                new { id = item.Id },
                MapToDto(createdItem));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _context.Items
                .Include(i => i.CreatedByUser)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (item == null)
            {
                return NotFound();
            }

            return Ok(MapToDto(item));
        }

        [Authorize]
        [HttpGet("{id}/matches")]
        public async Task<IActionResult> GetMatches(int id)
        {
            var item = await _context.Items
                .FirstOrDefaultAsync(i => i.Id == id);

            if (item == null)
            {
                return NotFound();
            }

            if (item.CreatedByUserId != CurrentUserId)
            {
                return Forbid();
            }

            var matches = await _matchingService
                .FindPotentialMatchesAsync(item);

            return Ok(matches.Select(MapToDto));
        }

        [Authorize]
        [HttpPatch("{id}/match/{matchedItemId}")]
        public async Task<IActionResult> ConfirmMatch(
            int id,
            int matchedItemId)
        {
            var item = await _context.Items.FindAsync(id);
            var matchedItem = await _context.Items.FindAsync(matchedItemId);

            if (item == null || matchedItem == null)
            {
                return NotFound();
            }

            if (item.CreatedByUserId != CurrentUserId)
            {
                return Forbid();
            }

            item.Status = ItemStatus.Matched;
            item.MatchedWithItemId = matchedItemId;

            matchedItem.Status = ItemStatus.Matched;
            matchedItem.MatchedWithItemId = id;

            await _context.SaveChangesAsync();

            await _hubContext.Clients
                .Group($"item-{id}")
                .SendAsync(
                    "ItemUpdated",
                    new { status = "Matched" });

            await _hubContext.Clients
                .Group($"item-{matchedItemId}")
                .SendAsync(
                    "ItemUpdated",
                    new { status = "Matched" });

            return Ok(new { message = "تم الربط بين البلاغين" });
        }

        [Authorize]
        [HttpPatch("{id}/close")]
        public async Task<IActionResult> Close(int id)
        {
            var item = await _context.Items.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            if (item.CreatedByUserId != CurrentUserId)
            {
                return Forbid();
            }

            item.Status = ItemStatus.Closed;

            await _context.SaveChangesAsync();

            await _hubContext.Clients
                .Group($"item-{id}")
                .SendAsync(
                    "ItemUpdated",
                    new { status = "Closed" });

            return NoContent();
        }

        private static ItemDto MapToDto(Item item)
        {
            return new ItemDto
            {
                Id = item.Id,
                Title = item.Title,
                Description = item.Description,
                Category = item.Category,
                ImageUrl = item.ImageUrl,
                Location = item.Location,
                Type = item.Type.ToString(),
                Status = item.Status.ToString(),
                CreatedAt = item.CreatedAt,
                CreatedByDisplayName =
                    item.CreatedByUser?.DisplayName ?? "مستخدم"
            };
        }
    }
}