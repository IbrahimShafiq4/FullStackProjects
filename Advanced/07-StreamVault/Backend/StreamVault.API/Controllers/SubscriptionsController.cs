using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StreamVault.Application.Interfaces;
using StreamVault.Domain.Services;
using System.Security.Claims;

namespace StreamVault.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SubscriptionsController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly ISubscriptionValidator _validator;

        public SubscriptionsController(IAppDbContext context, ISubscriptionValidator validator)
        {
            _context = context;
            _validator = validator;
        }

        private string CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException();

        [HttpGet("status")]
        public async Task<IActionResult> GetStatus(CancellationToken cancellationToken)
        {
            var subscription = await _context.Subscriptions
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.SubscriberId == CurrentUserId, cancellationToken);

            if (subscription is null)
            {
                return Ok(new { isActive = false, expiresAt = (DateTime?)null });
            }

            var isActive = _validator.IsActive(subscription, DateTime.UtcNow);

            return Ok(new
            {
                isActive,
                expiresAt = subscription.StartedAt.AddDays(subscription.DurationDays)
            });
        }
    }
}