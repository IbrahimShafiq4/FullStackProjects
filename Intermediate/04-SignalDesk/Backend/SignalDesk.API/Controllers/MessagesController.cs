using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalDesk.API.Hubs;
using SignalDesk.BLL.DTOs.Messages;
using SignalDesk.BLL.Services;
using SignalDesk.DAL.Models;
using SignalDesk.DAL.Repositories;
using System.Security.Claims;

namespace SignalDesk.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly ITicketRepository _repository;
        private readonly IMediaStorageService _mediaStorage;
        private readonly IHubContext<TicketHub> _hubContext; 

        public MessagesController(ITicketRepository repository, IMediaStorageService mediaStorage, IHubContext<TicketHub> hubContext)
        {
            _repository = repository;
            _mediaStorage = mediaStorage;
            _hubContext = hubContext;
        }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpPost("ticket/{ticketId}")]
        public async Task<ActionResult<MessageDto>> SendMessage(int ticketId, [FromForm] string content, IFormFile? attachment)
        {
            var ticket = await _repository.GetByIdWithMessagesAsync(ticketId);
            if (ticket == null) return NotFound();

            string? attachmentUrl = null;
            if (attachment != null && attachment.Length > 0)
            {
                var kind = attachment.ContentType.StartsWith("video") ? MediaKind.Video
                         : attachment.ContentType.StartsWith("audio") ? MediaKind.Voice
                         : MediaKind.Image;

                try
                {
                    attachmentUrl = await _mediaStorage.SaveAsync(attachment, kind);
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            var message = new TicketMessage
            {
                TicketId = ticketId,
                SenderId = GetCurrentUserId(),
                Content = content,
                AttachmentUrl = attachmentUrl,
                SentAt = DateTime.UtcNow
            };

            await _repository.AddMessageAsync(message);
            await _repository.SaveChangesAsync();

            var dto = new MessageDto
            {
                Id = message.Id,
                Content = message.Content,
                SentAt = message.SentAt,
                IsRead = false,
                SenderName = User.FindFirstValue(ClaimTypes.Name) ?? "",
                AttachmentUrl = message.AttachmentUrl
            };
            await _hubContext.Clients.Group($"ticket-{ticketId}").SendAsync("ReceiveMessage", dto);

            return Ok(dto);
        }

        // PATCH: api/messages/5/read
        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var message = await _repository.GetMessageByIdAsync(id);
            if (message == null) return NotFound();

            message.IsRead = true;
            await _repository.SaveChangesAsync();

            await _hubContext.Clients.Group($"ticket-{message.TicketId}").SendAsync("MessageRead", id);

            return Ok();
        }
    }
}
