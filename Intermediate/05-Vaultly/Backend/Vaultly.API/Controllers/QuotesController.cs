using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vaultly.Application.DTOs.Quotes;
using Vaultly.Application.Services;
using Vaultly.Domain.Enums;

namespace Vaultly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class QuotesController : ControllerBase
    {
        private readonly IQuoteService _quoteService;

        public QuotesController(IQuoteService quoteService)
        { _quoteService = quoteService; }

        private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<ActionResult<List<QuoteDto>>> GetQuotes() =>
            Ok(await _quoteService.GetQuotesAsync(GetCurrentUserId()));

        [HttpPost]
        public async Task<ActionResult<QuoteDto>> CreateQuote(CreateQuoteDto dto) =>
            Ok(await _quoteService.CreateQuoteAsync(GetCurrentUserId(), dto));

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromForm] QuoteStatus newStatus)
        {
            var (success, error) = await _quoteService.TransitionStatusAsync(id, newStatus, GetCurrentUserId());
            if(!success) { return BadRequest(error); }
            return Ok(new { message = "تم تحديث حالة العرض" });
        }
    }
}
