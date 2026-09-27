using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vaultly.Application.DTOs.Quotes;
using Vaultly.Application.Services;

namespace Vaultly.API.Controllers
{
    [ApiController]
    [Route("api/public/quotes")]
    [AllowAnonymous]
    public class PublicQuotesController : ControllerBase
    {
        private readonly IQuoteService _quoteService;

        public PublicQuotesController(IQuoteService quoteService)
        { _quoteService = quoteService; }

        [HttpGet("{token}")]
        public async Task<ActionResult<PublicQuoteDto>> Get(string token)
        {
            var quote = await _quoteService.GetPublicQuoteAsync(token);
            if (quote is null) return NotFound(new { message = "العرض غير موجود أو منتهي." });
            return Ok(quote);
        }

        [HttpPost("{token}/respond")]
        public async Task<IActionResult> Respond(string token, RespondToQuoteDto dto)
        {
            var (success, error) = await _quoteService.RespondToQuoteAsync(token, dto);
            if (!success) return BadRequest(new { message = error });
            return Ok(new { message = dto.Accepted ? "تم قبول العرض" : "تم رفض العرض" });
        }
    }
}