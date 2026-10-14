using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using R_FIT.Application.Features;
using R_FIT.Application.Interfaces;
using R_FIT.Domain.Entities;
using R_FIT.Infrastructure.Hubs;
using System.Security.Claims;

namespace R_FIT.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CommentsController : ControllerBase
    {
        private readonly IAppDbContext                  _context;
        private readonly IHubContext<NotificationHub>   _hubContext;
        public CommentsController(IAppDbContext context, IHubContext<NotificationHub> hubContext)
        { _context = context; _hubContext = hubContext; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("post/{postId:int}")]
        public async Task<IActionResult> GetByPost(int postId)
        {
            var comments = await _context
                            .Comments
                            .Include(c => c.Author)
                            .Include(c => c.Replies)
                            .OrderByDescending(c => c.CreatedAt)
                            .ToListAsync();

            return Ok(comments.Select(c =>
                new CommentDto(
                    c.Id,
                    c.Content,
                    c.Author.FullName,
                    c.Author.AvatarUrl,
                    c.CreatedAt,
                    c.ParentCommentId,
                    c.Replies.Count
                )
            ));
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var comment = await _context.Comments
                                .Include(c => c.Author)
                                .Include(c => c.Replies)
                                .FirstOrDefaultAsync(c => c.Id == id);

            return comment == null ? NotFound() : Ok(
                new CommentDto(
                    comment.Id,
                    comment.Content,
                    comment.Author.FullName,
                    comment.Author.AvatarUrl,
                    comment.CreatedAt,
                    comment.ParentCommentId,
                    comment.Replies.Count
                )
            );
        }

        [HttpGet("{id}/replies")]
        public async Task<IActionResult> GetReplies(int id)
        {
            var replies = await _context.Comments
                            .Include(c => c.Author)
                            .Include(c => c.Replies)
                            .Where(c => c.ParentCommentId == id)
                            .OrderBy(c => c.CreatedAt)
                            .ToListAsync();

            return Ok(replies.Select(c => 
                new CommentDto(
                        c.Id, 
                        c.Content, 
                        c.Author.FullName, 
                        c.Author.AvatarUrl, 
                        c.CreatedAt, 
                        c.ParentCommentId, 
                        c.Replies.Count
                    )
                )
            );
        }

        [HttpPost("post/{postId}")]
        public async Task<IActionResult> CreateOnPost(int postId, [FromBody] string content)
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post is null) return NotFound();

            var comment = new Comment
            {
                PostId = postId,
                Content = content,
                AuthorId = GetCurrentUserId()
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            if (post.AuthorId != GetCurrentUserId())
            {
                await NotifyAsync(post.AuthorId, NotificationType.NewComment, "علق أحدهم على منشورك", postId);
            }

            return Ok(new { comment.Id });
        }

        [HttpPost("{parentId}/reply")]
        public async Task<IActionResult> CreateReply(int parentId, [FromBody] string content)
        {
            var parentComment = await _context.Comments.FindAsync(parentId);
            if (parentComment is null) return NotFound();

            var reply = new Comment
            {
                PostId          = parentComment.PostId,
                Content         = content,
                AuthorId        = GetCurrentUserId(),
                ParentCommentId = parentId
            };

            _context.Comments.Add(reply);
            await _context.SaveChangesAsync();

            if (parentComment.AuthorId != GetCurrentUserId())
            {
                await NotifyAsync(parentComment.AuthorId, NotificationType.NewReply, "رد أحدهم على تعليقك.", parentComment.PostId);
            }

            return Ok(new { reply.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] string content)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();
            if (comment.AuthorId != GetCurrentUserId()) return Forbid();
            comment.Content = content;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();
            if (comment.AuthorId != GetCurrentUserId()) return Forbid();
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task NotifyAsync(string recipientId, NotificationType type, string message, int postId)
        {
            var notification = new Notification
            {
                RecipientId     = recipientId,
                Type            = type,
                Message         = message,
                RelatedPostId   = postId
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            await _hubContext.Clients.Group($"user-{recipientId}").SendAsync("NewNotification", new
            {
                notification.Id,
                notification.Message,
                type = notification.Type.ToString(),
                notification.CreatedAt
            });
        }
    }
}
