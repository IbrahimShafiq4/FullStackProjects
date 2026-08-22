using LostAndFoundApi.Api.Context;
using LostAndFoundApi.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LostAndFoundApi.Api.Services
{
    public class MatchingService: IMatchingService
    {
        private readonly AppDbContext   _context;
        private readonly DbSet<Item>    _dbSet;
        public MatchingService(AppDbContext context)
        { _context = context; _dbSet = _context.Set<Item>(); }

        public async Task<List<Item>> FindPotentialMatchesAsync(Item item)
        {
            var oppositeType = item.Type == ItemType.Found ? ItemType.Found : ItemType.Lost;

            var candidates = await _dbSet.Where(
                                                i => i.Type == oppositeType && 
                                                i.Status == ItemStatus.Open && 
                                                i.Category == item.Category
                                            )
                                         .ToListAsync();

            var keywords = ExtractKeywords(item.Title + " " + item.Description);

            var matches = candidates.Select(c => new
            {
                Item = c,
                Score = CalculateSimilarity(keywords, ExtractKeywords(c.Title + " " + c.Description))
            })
                .Where(x => x.Score > 0)
                .OrderByDescending(x => x.Score)
                .Select(x => x.Item)
                .Take(5)
                .ToList();

            return matches;
        }

        private static HashSet<string> ExtractKeywords(string text)
            => text.ToLower()
                   .Split(new[] { ' ', ',', '.', '-' }, StringSplitOptions.RemoveEmptyEntries)
                   .Where(w => w.Length > 2)
                   .ToHashSet();

        public static int CalculateSimilarity(HashSet<string> setA, HashSet<string> setB)
            => setA.Intersect(setB).Count();
    }
}
