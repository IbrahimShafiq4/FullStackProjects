using Asp.Versioning;
using FitTrackPro.API.DTOs;
using FitTrackPro.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FitTrackPro.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/ratings")]
    public class RatingsController : ControllerBase
    {
        private readonly IRatingService _ratingService;

        public RatingsController(IRatingService ratingService)
        {
            _ratingService = ratingService;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        }

        [HttpPost]
        [Authorize(Roles = "Trainee")]
        public async Task<IActionResult> AddRating([FromBody] AddRatingDto dto)
        {
            try
            {
                var rating = await _ratingService.AddRatingAsync(
                    GetCurrentUserId(),
                    dto.CoachId,
                    dto.Rating,
                    dto.Comment ?? "",
                    dto.WorkoutPlanId
                );

                return Ok(new { message = "تم إضافة التقييم بنجاح", ratingId = rating.Id });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("coach/{coachId}")]
        public async Task<IActionResult> GetCoachRatings(string coachId)
        {
            var ratings = await _ratingService.GetCoachRatingsAsync(coachId);
            var average = await _ratingService.GetCoachAverageRatingAsync(coachId);
            var count = await _ratingService.GetCoachRatingCountAsync(coachId);

            return Ok(new
            {
                averageRating = average,
                ratingCount = count,
                ratings = ratings.Select(r => new
                {
                    r.Id,
                    r.Rating,
                    r.Comment,
                    r.RatedAt,
                    traineeName = r.Trainee.FullName
                })
            });
        }

        [HttpGet("check/{coachId}")]
        [Authorize(Roles = "Trainee")]
        public async Task<IActionResult> CheckIfRated(string coachId)
        {
            var hasRated = await _ratingService.HasRatedAsync(GetCurrentUserId(), coachId);
            return Ok(new { hasRated });
        }

        [HttpGet("top-coaches")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTopCoaches([FromQuery] int take = 5)
        {
            var coaches = await _ratingService.GetTopCoachesAsync(take);
            return Ok(coaches);
        }
    }
}
