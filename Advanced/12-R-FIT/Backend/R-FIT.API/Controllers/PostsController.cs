using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using R_FIT.Application.Features;
using R_FIT.Application.Interfaces;
using R_FIT.Domain.Entities;
using R_FIT.Domain.Enums;
using System.Security.Claims;

namespace R_FIT.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PostsController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public PostsController(IAppDbContext context)
        { _context = context; }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? platform)
        {
            var query = _context.Posts.Include(p => p.Author)
                .Include(p => p.Targets)
                .Include(p => p.Reactions)
                .Include(p => p.Comments)
                .Include(p => p.Shares)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(platform) && Enum.TryParse<PlatformType>(platform, true, out var platformType))
            {
                query = query.Where(p => p.Targets.Any(t => t.Platform == platformType));
            }

            var posts = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
            return Ok(posts.Select(
                p => new PostDto(
                        p.Id,
                        p.Content,
                        p.Author.FullName,
                        p.Author.AvatarUrl,
                        p.CreatedAt,
                        p.Targets.Select(t =>
                            t.Platform.ToString())
                        .ToList(),
                        p.Reactions.Count,
                        p.Comments.Count,
                        p.Shares.Count
                    )
                )
            );
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var p = await _context.Posts.Include(x => x.Author)
                .Include(x => x.Targets)
                .Include(x => x.Reactions)
                .Include(x => x.Comments)
                .Include(x => x.Shares)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (p is null)
                return NotFound();

            return Ok(new PostDto(
                    p.Id,
                    p.Content,
                    p.Author.FullName,
                    p.Author.AvatarUrl,
                    p.CreatedAt,
                    p.Targets.Select(t =>
                        t.Platform.ToString()
                    ).ToList(),
                    p.Reactions.Count,
                    p.Comments.Count,
                    p.Shares.Count
                )
            );
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] string content, [FromForm] string platformsJson, [FromForm] string? hashtagsJson) {
            var platformNames = System.
                                Text.
                                Json.
                                JsonSerializer.
                                Deserialize<List<string>>(platformsJson) ?? new();

            if (platformNames.Count == 0) return BadRequest("يجب إختيار منصة واحدة على الأقل.");
            var post = new Post { Content = content, AuthorId = GetCurrentUserId() };

            foreach(var platformName in platformNames)
            {
                if (Enum.TryParse<PlatformType>(platformName, true, out var platform))
                {
                    post.Targets.Add(new PostTarget { Platform = platform });
                }
            }

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            if (!string.IsNullOrWhiteSpace(hashtagsJson))
            {
                var hashtagNames = System.
                    Text.
                    Json.
                    JsonSerializer.
                    Deserialize<List<string>>(hashtagsJson) ?? new();

                foreach(var tagName in hashtagNames) 
                {
                    var hashtag = await _context.Hashtags.FirstOrDefaultAsync(h => h.Name == tagName);
                    if (hashtag is null)
                    {
                        hashtag = new Hashtag { Name = tagName };
                        _context.Hashtags.Add(hashtag);
                        await _context.SaveChangesAsync();
                    }

                    _context.PostHashtags.Add(new PostHashtag { PostId = post.Id, HashtagId = hashtag.Id });
                }
                await _context.SaveChangesAsync();
            }

            return Ok(new { post.Id, platformsCount = post.Targets.Count });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromForm] string content)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post is null) return NotFound();
            if (post.AuthorId != GetCurrentUserId()) return Forbid();
            post.Content = content;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post is null) return NotFound();
            if (post.AuthorId == GetCurrentUserId()) return Forbid();
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(string userId, [FromQuery] string? platform)
        {
            var query = _context.Posts
                                .Include(p => p.Author)
                                .Include(p => p.Targets)
                                .Include(p => p.Reactions)
                                .Include(p => p.Shares)
                                .Include(p => p.Comments)
                                .Where(p => p.AuthorId == userId)
                                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(platform) && Enum.TryParse<PlatformType>(platform, true, out var platformType))
            {
                query = query.Where(p => p.Targets.Any(t => t.Platform == platformType));
            }

            var posts = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
            return Ok(posts.Select(p =>
                    new PostDto(
                        p.Id,
                        p.Content,
                        p.Author.FullName,
                        p.Author.AvatarUrl,
                        p.CreatedAt,
                        p.Targets.Select(t => t.Platform.ToString()).ToList(),
                        p.Reactions.Count,
                        p.Comments.Count,
                        p.Shares.Count
                    )
                )
            );
        }

        [HttpGet("hashtag/{tagName}")]
        public async Task<IActionResult> GetByHashtag(string tagName)
        {
            var postIds = await _context.PostHashtags
                                .Include(ph => ph.Hashtag)
                                .Where(ph => ph.Hashtag.Name == tagName)
                                .Select(ph => ph.PostId)
                                .ToListAsync();

            var posts = await _context.Posts
                                .Include(p => p.Author)
                                .Include(p => p.Targets)
                                .Include(p => p.Reactions)
                                .Include(p => p.Comments)
                                .Include(p => p.Shares)
                                .Where(p => postIds.Contains(p.Id))
                                .ToListAsync();

            return Ok(
                posts.Select(p => new PostDto(
                        p.Id,
                        p.Content,
                        p.Author.FullName,
                        p.Author.AvatarUrl,
                        p.CreatedAt,
                        p.Targets.Select(t => t.Platform.ToString()).ToList(),
                        p.Reactions.Count,
                        p.Comments.Count,
                        p.Shares.Count
                    )
                )    
            );
        }
    }
}
