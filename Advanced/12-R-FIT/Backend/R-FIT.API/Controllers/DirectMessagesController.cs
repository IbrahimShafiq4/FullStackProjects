using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using R_FIT.Application.Interfaces;
using R_FIT.Domain.Entities;
using R_FIT.Infrastructure.Hubs;
using System.Security.Claims;

namespace R_FIT.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectMessagesController : ControllerBase
    {
        private readonly IAppDbContext                  _context;
        private readonly IHubContext<NotificationHub>   _hubContext;

        public DirectMessagesController(IAppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("conversation/{otherUserId}")]
        public async Task<IActionResult> GetConversation(string otherUserId)
        {
            var userId = GetCurrentUserId();
            var message = await _context.DirectMessages
                .Where(dm => 
                    dm.SenderId == userId && 
                    dm.ReceiverId == otherUserId || 
                    (dm.SenderId == otherUserId && 
                    dm.ReceiverId == userId)
                )
                .OrderBy(dm => dm.SentAt)
                .Select(dm => new
                {
                    dm.Id,
                    dm.Content,
                    dm.SenderId,
                    dm.IsRead,
                    dm.SentAt
                })
                .ToListAsync();

            return Ok(message);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var message = await _context.DirectMessages.FindAsync(id);
            return message is null ? NotFound() : Ok(new
            {
                message.Id,
                message.Content,
                message.SenderId,
                message.ReceiverId,
                message.SentAt,
                message.IsRead
            });
        }

        [HttpGet("inbox")]
        public async Task<IActionResult> GetInbox()
        {
            var userId = GetCurrentUserId();
            var messages = await _context.DirectMessages
                    .Where(dm =>
                        dm.SenderId == userId ||
                        dm.ReceiverId == userId
                    ).OrderByDescending(dm => dm.SentAt)
                    .ToListAsync();

            var conversations = messages
                .GroupBy(dm => dm.SenderId == userId ? dm.ReceiverId : dm.SenderId)
                .Select(g => new
                {
                    OtherUserId = g.Key,
                    LastMessage = g.First().Content,
                    LastSentAt = g.First().SentAt,
                    UnreadCount = g.Count(m => m.ReceiverId == userId && !m.IsRead)
                });

            return Ok(conversations);
        }

        [HttpPost]
        public async Task<IActionResult> Send([FromForm] string receiverId, [FromForm] string content)
        {
            var message = new DirectMessage
            {
                SenderId = GetCurrentUserId(),
                Content = content,
                ReceiverId = receiverId
            };

            _context.DirectMessages.Add(message);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group($"user-{receiverId}")
                .SendAsync("NewDirectMessage", 
                    new 
                    { 
                        message.Id, 
                        message.Content, 
                        message.SenderId, 
                        message.SentAt 
                    }
                );

            return Ok(new { message.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] string content)
        {
            var message = await _context.DirectMessages.FindAsync(id);
            if (message is null) return NotFound();

            if (message.SenderId != GetCurrentUserId()) return Forbid();
            message.Content = content;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var message = await _context.DirectMessages.FindAsync(id);
            if (message is null) return NotFound();

            if (message.SenderId != GetCurrentUserId()) return Forbid();

            _context.DirectMessages.Remove(message);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var message = await _context.DirectMessages.FindAsync(id);
            if (message is null) return NotFound();

            message.IsRead = true;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
