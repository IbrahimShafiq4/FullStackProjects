using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShelfLife.Infrastructure.Data;
using System.Security.Claims;

namespace ShelfLife.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RecipesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RecipesController(AppDbContext context)
        {
            _context = context;
        }

        private string GetCurrentUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet("suggestions")]
        public async Task<IActionResult> GetSuggestions()
        {
            var userId = GetCurrentUserId();

            var soonExpiring = await _context.Products
                .Where(p => p.AppUserId == userId
                         && p.ExpiryDate.Date <= DateTime.UtcNow.Date.AddDays(3)
                         && p.ExpiryDate.Date >= DateTime.UtcNow.Date)
                .Select(p => p.Name)
                .ToListAsync();

            var suggestions = BuildSuggestions(soonExpiring);

            return Ok(new
            {
                expiringCount = soonExpiring.Count,
                expiringItems = soonExpiring,
                suggestions
            });
        }

        private static List<RecipeSuggestionDto> BuildSuggestions(List<string> availableNames)
        {
            var catalog = new List<RecipeSuggestion>
            {
                new("شكشوكة الطماطم", new[] { "طماطم", "بيض", "بصل", "زيت" }, 15, "سهل", "🍅"),
                new("سلطة الفواكه", new[] { "موز", "تفاح", "برتقال", "عنب" }, 10, "سهل", "🍓"),
                new("مكرونة بالجبنة", new[] { "مكرونة", "جبنة", "لبن", "زبدة" }, 20, "متوسط", "🍝"),
                new("بيض بالبسطرمة", new[] { "بيض", "بسطرمة", "زيت" }, 10, "سهل", "🍳"),
                new("عجة الخضار", new[] { "بيض", "كوسة", "جزر", "بصل" }, 18, "سهل", "🥚"),
                new("سلطة خضراء", new[] { "خيار", "طماطم", "خس", "ليمون" }, 8, "سهل", "🥗"),
                new("شوربة العدس", new[] { "عدس", "بصل", "جزر", "كمون" }, 35, "متوسط", "🥣"),
                new("أرز باللبن", new[] { "أرز", "لبن", "سكر" }, 25, "سهل", "🍚"),
                new("توست بالجبنة", new[] { "عيش", "جبنة", "زبدة" }, 7, "سهل", "🥪"),
                new("عصير برتقال", new[] { "برتقال", "سكر" }, 5, "سهل", "🍊")
            };

            return catalog
                .Select(recipe =>
                {
                    var matched = recipe.Ingredients
                        .Where(ing => availableNames.Any(n =>
                            n.Contains(ing, StringComparison.OrdinalIgnoreCase) ||
                            ing.Contains(n, StringComparison.OrdinalIgnoreCase)))
                        .ToList();

                    var matchPercent = recipe.Ingredients.Length > 0
                        ? (int)Math.Round((double)matched.Count / recipe.Ingredients.Length * 100)
                        : 0;

                    return new
                    {
                        recipe.Title,
                        recipe.Time,
                        recipe.Difficulty,
                        recipe.Emoji,
                        MatchedIngredients = matched,
                        MissingIngredients = recipe.Ingredients.Except(matched).ToList(),
                        MatchPercent = matchPercent
                    };
                })
                .Where(r => r.MatchPercent >= 40)
                .OrderByDescending(r => r.MatchPercent)
                .ThenBy(r => r.Time)
                .Take(6)
                .Select(r => new RecipeSuggestionDto(
                    r.Title,
                    r.MatchedIngredients,
                    r.MissingIngredients,
                    r.Time,
                    r.Difficulty,
                    r.Emoji,
                    r.MatchPercent
                ))
                .ToList();
        }
    }

    internal record RecipeSuggestion(
        string Title,
        string[] Ingredients,
        int Time,
        string Difficulty,
        string Emoji);

    public record RecipeSuggestionDto(
        string Title,
        List<string> MatchedIngredients,
        List<string> MissingIngredients,
        int Time,
        string Difficulty,
        string Emoji,
        int MatchPercent);
}