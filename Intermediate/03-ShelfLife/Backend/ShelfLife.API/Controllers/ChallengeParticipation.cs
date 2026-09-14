using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShelfLife.Application.DTOs;
using ShelfLife.Domain.Entities;
using ShelfLife.Infrastructure.Data;
using ShelfLife.Infrastructure.Services;
using System.Security.Claims;

namespace ShelfLife.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChallengeParticipationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMediaStorageService _mediaStorage;

        public ChallengeParticipationsController(
            AppDbContext context,
            UserManager<AppUser> userManager,
            IMediaStorageService mediaStorage)
        {
            _context = context;
            _userManager = userManager;
            _mediaStorage = mediaStorage;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        private async Task<bool> IsCurrentUserAdminAsync()
        {
            var userId = GetCurrentUserId();
            var user = await _userManager.FindByIdAsync(userId);
            return user?.IsAdmin ?? false;
        }

        // المستخدم يشوف مشاركته الحالية
        [HttpGet("my/{challengeId}")]
        public async Task<IActionResult> GetMyParticipation(int challengeId)
        {
            var userId = GetCurrentUserId();

            var participation = await _context.ChallengeParticipations
                .Where(p => p.ChallengeId == challengeId && p.AppUserId == userId)
                .Select(p => new ChallengeParticipationDto
                {
                    Id = p.Id,
                    ChallengeId = p.ChallengeId,
                    UserId = p.AppUserId,
                    UserName = p.AppUser.FullName,
                    PhotoUrl = p.PhotoUrl,
                    Caption = p.Caption,
                    SubmittedAt = p.SubmittedAt,
                    Rank = p.Rank
                })
                .FirstOrDefaultAsync();

            return Ok(participation);
        }

        // المستخدم يرفع مشاركته
        [HttpPost]
        public async Task<IActionResult> Submit([FromForm] CreateParticipationDto dto, IFormFile? photo)
        {
            if (photo == null || photo.Length == 0)
                return BadRequest(new { message = "لازم ترفع صورة" });

            var userId = GetCurrentUserId();

            var challenge = await _context.Challenges
                .FirstOrDefaultAsync(c => c.Id == dto.ChallengeId && c.IsActive);

            if (challenge == null)
                return BadRequest(new { message = "التحدي مش موجود أو مش نشط" });

            var existing = await _context.ChallengeParticipations
                .FirstOrDefaultAsync(p => p.ChallengeId == dto.ChallengeId && p.AppUserId == userId);

            if (existing != null)
                return BadRequest(new { message = "أنت شاركت بالفعل في هذا التحدي" });

            string photoUrl;
            try
            {
                photoUrl = await _mediaStorage.SaveAsync(photo, MediaKind.Image);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            var participation = new ChallengeParticipation
            {
                ChallengeId = dto.ChallengeId,
                AppUserId = userId,
                PhotoUrl = photoUrl,
                Caption = (dto.Caption ?? string.Empty).Trim(),
                SubmittedAt = DateTime.UtcNow,
                Rank = null
            };

            _context.ChallengeParticipations.Add(participation);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = participation.Id,
                message = "تم إرسال مشاركتك بنجاح 🎉"
            });
        }

        // المستخدم يحذف مشاركته
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetCurrentUserId();

            var participation = await _context.ChallengeParticipations
                .FirstOrDefaultAsync(p => p.Id == id && p.AppUserId == userId);

            if (participation == null) return NotFound();

            if (participation.Rank.HasValue)
                return BadRequest(new { message = "مش ممكن تحذف مشاركة فزت فيها" });

            if (!string.IsNullOrEmpty(participation.PhotoUrl))
                _mediaStorage.Delete(participation.PhotoUrl);

            _context.ChallengeParticipations.Remove(participation);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم حذف المشاركة" });
        }

        // الأدمن يشوف كل المشاركات في تحدي
        [HttpGet("challenge/{challengeId}")]
        public async Task<IActionResult> GetForChallenge(int challengeId)
        {
            var participations = await _context.ChallengeParticipations
                .Where(p => p.ChallengeId == challengeId)
                .OrderBy(p => p.Rank ?? 999)
                .ThenBy(p => p.SubmittedAt)
                .Select(p => new ChallengeParticipationDto
                {
                    Id = p.Id,
                    ChallengeId = p.ChallengeId,
                    UserId = p.AppUserId,
                    UserName = p.AppUser.FullName,
                    PhotoUrl = p.PhotoUrl,
                    Caption = p.Caption,
                    SubmittedAt = p.SubmittedAt,
                    Rank = p.Rank
                })
                .ToListAsync();

            return Ok(participations);
        }

        // الأدمن يحدد الرتبة (1، 2، 3، أو null للشيل)
        [HttpPatch("{id}/rank")]
        public async Task<IActionResult> SetRank(int id, [FromBody] SetRankDto dto)
        {
            if (!await IsCurrentUserAdminAsync()) return Forbid();

            if (dto.Rank.HasValue && (dto.Rank < 1 || dto.Rank > 3))
                return BadRequest(new { message = "الرتبة لازم تكون 1 أو 2 أو 3" });

            var participation = await _context.ChallengeParticipations
                .FirstOrDefaultAsync(p => p.Id == id);

            if (participation == null) return NotFound();

            // لو بيحط نفس الرتبة على مشاركة تانية، شيل الرتبة من التانية
            if (dto.Rank.HasValue)
            {
                var existing = await _context.ChallengeParticipations
                    .Where(p => p.ChallengeId == participation.ChallengeId
                             && p.Rank == dto.Rank
                             && p.Id != id)
                    .ToListAsync();

                foreach (var p in existing)
                    p.Rank = null;
            }

            participation.Rank = dto.Rank;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = dto.Rank.HasValue
                    ? $"تم تعيين المركز {dto.Rank}"
                    : "تم إلغاء المركز"
            });
        }

        // Top 3 للـ landing page
        [HttpGet("challenge/{challengeId}/winners")]
        [AllowAnonymous]
        public async Task<IActionResult> GetWinners(int challengeId)
        {
            var winners = await _context.ChallengeParticipations
                .Where(p => p.ChallengeId == challengeId && p.Rank != null)
                .OrderBy(p => p.Rank)
                .Select(p => new
                {
                    p.Id,
                    p.Rank,
                    UserName = p.AppUser.FullName,
                    p.PhotoUrl,
                    p.Caption
                })
                .ToListAsync();

            return Ok(winners);
        }
    }
}