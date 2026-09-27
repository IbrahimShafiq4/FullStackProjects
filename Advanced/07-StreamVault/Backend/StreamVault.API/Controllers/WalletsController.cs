using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamVault.Application.Features;
using StreamVault.Application.Interfaces;
using StreamVault.Domain.Domain;
using StreamVault.Domain.Entities;
using System.Security.Claims;

namespace StreamVault.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WalletsController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public WalletsController(IAppDbContext context)
        {
            _context = context;
        }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();

        [HttpGet("my")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> GetMyWallets(CancellationToken cancellationToken)
        {
            var wallets = await _context.TeacherWallets
                .AsNoTracking()
                .Where(w => w.TeacherId == CurrentUserId)
                .OrderByDescending(w => w.IsDefault)
                .ThenByDescending(w => w.UpdatedAt)
                .Select(w => new TeacherWalletDto(w.Id, w.Provider, w.WalletNumber, w.AccountName, w.Instructions, w.IsDefault))
                .ToListAsync(cancellationToken);

            return Ok(wallets);
        }

        [HttpPost("my")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> AddWallet(SaveTeacherWalletDto dto, CancellationToken cancellationToken)
        {
            if (dto.IsDefault)
            {
                var existing = await _context.TeacherWallets
                    .Where(w => w.TeacherId == CurrentUserId && w.IsDefault)
                    .ToListAsync(cancellationToken);

                foreach (var w in existing) w.IsDefault = false;
            }

            var wallet = new TeacherWallet
            {
                TeacherId = CurrentUserId,
                Provider = dto.Provider,
                WalletNumber = dto.WalletNumber,
                AccountName = dto.AccountName,
                Instructions = dto.Instructions,
                IsDefault = dto.IsDefault,
                UpdatedAt = DateTime.UtcNow
            };

            _context.TeacherWallets.Add(wallet);
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { wallet.Id, message = "تم إضافة طريقة الدفع" });
        }

        [HttpPut("my/{id:int}")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> UpdateWallet(int id, SaveTeacherWalletDto dto, CancellationToken cancellationToken)
        {
            var wallet = await _context.TeacherWallets
                .FirstOrDefaultAsync(w => w.Id == id && w.TeacherId == CurrentUserId, cancellationToken);

            if (wallet is null)
                return NotFound(new { message = "طريقة الدفع غير موجودة" });

            if (dto.IsDefault)
            {
                var others = await _context.TeacherWallets
                    .Where(w => w.TeacherId == CurrentUserId && w.Id != id && w.IsDefault)
                    .ToListAsync(cancellationToken);

                foreach (var w in others) w.IsDefault = false;
            }

            wallet.Provider = dto.Provider;
            wallet.WalletNumber = dto.WalletNumber;
            wallet.AccountName = dto.AccountName;
            wallet.Instructions = dto.Instructions;
            wallet.IsDefault = dto.IsDefault;
            wallet.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { message = "تم تحديث طريقة الدفع" });
        }

        [HttpDelete("my/{id:int}")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> DeleteWallet(int id, CancellationToken cancellationToken)
        {
            var wallet = await _context.TeacherWallets
                .FirstOrDefaultAsync(w => w.Id == id && w.TeacherId == CurrentUserId, cancellationToken);

            if (wallet is null)
                return NotFound(new { message = "طريقة الدفع غير موجودة" });

            _context.TeacherWallets.Remove(wallet);
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new { message = "تم حذف طريقة الدفع" });
        }

        [HttpGet("teacher/{teacherId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTeacherWallets(string teacherId, CancellationToken cancellationToken)
        {
            var wallets = await _context.TeacherWallets
                .AsNoTracking()
                .Where(w => w.TeacherId == teacherId)
                .OrderByDescending(w => w.IsDefault)
                .ThenByDescending(w => w.UpdatedAt)
                .Select(w => new TeacherWalletDto(w.Id, w.Provider, w.WalletNumber, w.AccountName, w.Instructions, w.IsDefault))
                .ToListAsync(cancellationToken);

            return Ok(wallets);
        }
    }
}