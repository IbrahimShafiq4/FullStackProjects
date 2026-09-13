using FitTrackPro.API.Data;
using FitTrackPro.API.DTOs;
using FitTrackPro.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FitTrackPro.API.Services
{
    public interface IRatingService
    {
        Task<bool>                  HasRatedAsync(string traineedId, string coachId);
        Task<CoachRating>           AddRatingAsync(string traineeId, string coachId, int rating, string comment, int? workoutPlanId);
        Task<double>                GetCoachAverageRatingAsync(string coachId);
        Task<int>                   GetCoachRatingCountAsync(string coachId);
        Task<List<CoachRating>>     GetCoachRatingsAsync(string coachId);
        Task<List<CoachRatingDto>>  GetTopCoachesAsync(int take = 5);

    }

    public class RatingService: IRatingService
    {
        private readonly AppDbContext _context;

        public RatingService(AppDbContext context)
        { _context = context; }

        public async Task<bool> HasRatedAsync(string traineeId, string coachId) =>
            await _context.CoachRatings.AnyAsync(cr => cr.TraineeId == traineeId && cr.CoachId == coachId);

        public async Task<CoachRating> AddRatingAsync(string traineeId, string coachId, int rating, string comment, int? workoutPlanId)
        {
            if (await HasRatedAsync(traineeId, coachId))
                throw new InvalidOperationException("أنت قيمت المدرب دا قبل كدة");

            var coachRating = new CoachRating
            {
                TraineeId       = traineeId,
                CoachId         = coachId,
                Comment         = comment,
                Rating          = Math.Clamp(rating, 1, 5),
                WorkoutPlanId   = workoutPlanId
            };

            _context.CoachRatings.Add(coachRating);
            await _context.SaveChangesAsync();
            return coachRating;
        }
    
        public async Task<double> GetCoachAverageRatingAsync(string coachId)
        {
            var ratings = await _context.CoachRatings
                .Where(cr => cr.CoachId == coachId)
                .Select(cr => cr.Rating)
                .ToListAsync();

            return ratings.Count > 0 ? ratings.Average() : 0;
        }

        public async Task<int> GetCoachRatingCountAsync(string coachId) =>
            await _context.CoachRatings
                          .CountAsync(cr => cr.CoachId == coachId);

        public async Task<List<CoachRating>> GetCoachRatingsAsync(string coachId) =>
            await _context.CoachRatings
                .Include(cr => cr.Trainee)
                .Where(cr => cr.CoachId == coachId)
                .OrderByDescending(cr => cr.RatedAt)
                .ToListAsync();

        public async Task<List<CoachRatingDto>> GetTopCoachesAsync(int take = 5)
        {
            var topCoaches = await _context.CoachRatings
                .GroupBy(r => r.CoachId)
                .Select(g => new CoachRatingDto
                {
                    CoachId = g.Key,
                    CoachName = g.First().Coach.FullName,
                    AverageRating = Math.Round(g.Average(r => r.Rating), 1),
                    RatingCount = g.Count()
                })
                .OrderByDescending(x => x.AverageRating)
                .Take(take)
                .ToListAsync();

            return topCoaches;
        }
    }
}
