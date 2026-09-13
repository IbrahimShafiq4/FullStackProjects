using EventHive.Application.DTOs.Events;
using EventHive.Application.DTOs.Landing;
using EventHive.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventHive.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class LandingController : ControllerBase
    {
        private readonly ILandingService _landingService;

        public LandingController(ILandingService landingService)
        {
            _landingService = landingService;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<LandingStatsDto>> GetStats()
            => Ok(await _landingService.GetStatsAsync());

        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetFeatured([FromQuery] int count = 6)
            => Ok(await _landingService.GetFeaturedEventsAsync(count));

        [HttpGet("testimonials")]
        public async Task<ActionResult<IEnumerable<TestimonialDto>>> GetTestimonials()
            => Ok(await _landingService.GetTestimonialsAsync());

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
            => Ok(await _landingService.GetCategoriesAsync());
    }
}
