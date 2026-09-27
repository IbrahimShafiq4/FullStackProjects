using EventSphere.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventSphere.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PricingRulesController : ControllerBase
    {
        private readonly IPriceCalculator _priceCalculator;
        public PricingRulesController(IPriceCalculator priceCalculator)
        { _priceCalculator = priceCalculator; }

        [HttpGet("preview")]
        public IActionResult PreviewPricing([FromQuery] decimal basePrice, [FromQuery] DateTime eventDate)
        {
            var price = _priceCalculator.CalculateFinalPrice(basePrice, eventDate);
            return Ok(new { basePrice, eventDate, finalPrice = price });
        }
    }
}
