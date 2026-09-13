using ChatterHub.API.Hubs;
using ChatterHub.API.Models;
using ChatterHub.API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace ChatterHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHubContext<RoomHub> _hubContext;
        private readonly IWebHostEnvironment _environment;

        private static readonly string[] AllowedExtensions =
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".webp",
            ".pdf",
            ".doc",
            ".docx",
            ".xls",
            ".xlsx",
            ".txt",
            ".zip"
        };

        private const long MaxFileSize = 10 * 1024 * 1024;

        public MessagesController(
            IUnitOfWork unitOfWork,
            IHubContext<RoomHub> hubContext,
            IWebHostEnvironment environment)
        {
            _unitOfWork = unitOfWork;
            _hubContext = hubContext;
            _environment = environment;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        }

        private string GetCurrentUserName()
        {
            return User.FindFirstValue(ClaimTypes.Name) ?? "Unknown";
        }

        [HttpPost("room/{roomId}")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<IActionResult> SendMessage(
            int roomId,
            [FromForm] string? content,
            [FromForm] IFormFile? attachment)
        {
            var room = await _unitOfWork.Rooms.GetByIdAsync(roomId);

            if (room is null)
                return NotFound();

            if (string.IsNullOrWhiteSpace(content) && attachment is null)
                return BadRequest("الرسالة لا يمكن أن تكون فارغة");

            string? attachmentUrl = null;

            if (attachment is not null)
            {
                if (attachment.Length > MaxFileSize)
                    return BadRequest("حجم الملف يجب ألا يتجاوز 10MB");

                var extension =
                    Path.GetExtension(attachment.FileName)
                    .ToLowerInvariant();

                if (!AllowedExtensions.Contains(extension))
                    return BadRequest("نوع الملف غير مسموح");

                var uploadsFolder = Path.Combine(
                    _environment.WebRootPath,
                    "uploads",
                    "messages"
                );

                Directory.CreateDirectory(uploadsFolder);

                var fileName =
                    $"{Guid.NewGuid():N}{extension}";

                var filePath = Path.Combine(
                    uploadsFolder,
                    fileName
                );

                await using var stream =
                    new FileStream(
                        filePath,
                        FileMode.Create
                    );

                await attachment.CopyToAsync(stream);

                attachmentUrl =
                    $"/uploads/messages/{fileName}";
            }

            var message = new RoomMessage
            {
                RoomId = roomId,
                SenderId = GetCurrentUserId(),
                Content = content ?? string.Empty,
                AttachmentUrl = attachmentUrl,
                SentAt = DateTime.UtcNow
            };

            await _unitOfWork.Messages.AddAsync(message);

            room.LastActivityAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();

            var dto = new
            {
                message.Id,
                message.Content,
                message.SentAt,
                SenderId = message.SenderId,
                SenderName = GetCurrentUserName(),
                message.AttachmentUrl
            };

            await _hubContext.Clients
                .Group($"room-{roomId}")
                .SendAsync(
                    "ReceiveMessage",
                    dto
                );

            return Ok(dto);
        }
    }
}