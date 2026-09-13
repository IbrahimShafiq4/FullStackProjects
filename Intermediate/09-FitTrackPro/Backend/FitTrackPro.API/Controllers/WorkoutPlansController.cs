using Asp.Versioning;
using FitTrackPro.API.Data;
using FitTrackPro.API.DTOs;
using FitTrackPro.API.Models;
using FitTrackPro.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FitTrackPro.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize]
    public class WorkoutPlansController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMediaStorageService _mediaStorage;

        public WorkoutPlansController(
            AppDbContext context,
            IMediaStorageService mediaStorage)
        {
            _context = context;
            _mediaStorage = mediaStorage;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirstValue(
                ClaimTypes.NameIdentifier
            )!;
        }

        [HttpGet]
        public async Task<IActionResult> GetPlans()
        {
            var plans = await _context.WorkoutPlans
                .Include(p => p.Coach)
                .Include(p => p.Exercises)
                .Select(p => new WorkoutPlanDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    CoachName = p.Coach.FullName,
                    CoachId = p.CoachId,
                    Exercises = p.Exercises
                        .Select(e => new ExerciseDto
                        {
                            Id = e.Id,
                            Name = e.Name,
                            TargetSets = e.TargetSets,
                            TargetReps = e.TargetReps,
                            DemoVideoUrl = e.DemoVideoUrl
                        })
                        .ToList()

                })
                .ToListAsync();

            return Ok(plans);
        }

        [HttpPost]
        [Authorize(Roles = "Coach")]
        public async Task<IActionResult> CreatePlan(
            CreatePlanDto dto)
        {
            var plan = new WorkoutPlan
            {
                Title = dto.Title,
                Description = dto.Description,
                CoachId = GetCurrentUserId()
            };

            _context.WorkoutPlans.Add(plan);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                plan.Id
            });
        }

        [HttpPost("{planId}/exercises")]
        [Authorize(Roles = "Coach")]

        [RequestSizeLimit(2L * 1024 * 1024 * 1024)]

        [RequestFormLimits(
            MultipartBodyLengthLimit =
                2L * 1024 * 1024 * 1024
        )]

        public async Task<IActionResult> AddExercise(
            int planId,
            [FromForm] CreateExerciseDto dto,
            IFormFile? demoVideo)
        {
            var plan =
                await _context.WorkoutPlans.FindAsync(planId);

            if (plan is null)
            {
                return NotFound();
            }

            if (plan.CoachId != GetCurrentUserId())
            {
                return Forbid();
            }


            string? videoUrl = null;


            if (demoVideo is not null &&
                demoVideo.Length > 0)
            {
                try
                {
                    videoUrl =
                        await _mediaStorage.SaveAsync(
                            demoVideo,
                            MediaKind.Video
                        );
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(ex.Message);
                }
            }


            var exercise = new Exercise
            {
                WorkoutPlanId = planId,
                Name = dto.Name,
                TargetReps = dto.TargetReps,
                TargetSets = dto.TargetSets,
                DemoVideoUrl = videoUrl
            };

            _context.Exercises.Add(exercise);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                exercise.Id
            });
        }

        [HttpPost("{planId}/enroll")]
        [Authorize(Roles = "Trainee")]
        public async Task<IActionResult> Enroll(
            int planId)
        {
            var alreadyEnrolled =
                await _context.PlanEnrollments
                    .AnyAsync(pe =>
                        pe.WorkoutPlanId == planId &&
                        pe.TraineeId == GetCurrentUserId()
                    );

            if (alreadyEnrolled)
            {
                return BadRequest(
                    "أنت مشترك فى هذه الخطة بالفعل"
                );
            }

            _context.PlanEnrollments.Add(
                new PlanEnrollment
                {
                    WorkoutPlanId = planId,
                    TraineeId = GetCurrentUserId()
                }
            );

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "تم الإشتراك بنجاح"
            });
        }

        [HttpGet("coach-stats")]
        [Authorize(Roles = "Coach")]
        public async Task<IActionResult> GetCoachStats()
        {
            var coachId = GetCurrentUserId();

            var planCount = await _context.WorkoutPlans
                .CountAsync(p => p.CoachId == coachId);

            var totalTrainees = await _context.PlanEnrollments
                .Include(pe => pe.WorkoutPlan)
                .Where(pe => pe.WorkoutPlan.CoachId == coachId)
                .Select(pe => pe.TraineeId)
                .Distinct()
                .CountAsync();

            var totalExercises = await _context.Exercises
                .Include(e => e.WorkoutPlan)
                .Where(e => e.WorkoutPlan.CoachId == coachId)
                .CountAsync();

            var totalLogs = await _context.WorkoutLogs
                .Include(wl => wl.Exercise)
                    .ThenInclude(e => e.WorkoutPlan)
                .Where(wl => wl.Exercise.WorkoutPlan.CoachId == coachId)
                .CountAsync();

            var averageRating = await _context.CoachRatings
                .Where(r => r.CoachId == coachId)
                .Select(r => r.Rating)
                .ToListAsync();

            double avgRating = averageRating.Count > 0 ? averageRating.Average() : 0;
            int ratingCount = averageRating.Count;

            return Ok(new
            {
                planCount,
                totalTrainees,
                totalExercises,
                totalLogs,
                avgRating,
                ratingCount
            });
        }
    }
}