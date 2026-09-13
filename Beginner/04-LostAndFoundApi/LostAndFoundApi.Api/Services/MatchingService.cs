using LostAndFoundApi.Api.Context;
using LostAndFoundApi.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LostAndFoundApi.Api.Services
{
    public class MatchingService : IMatchingService
    {
        private readonly AppDbContext _context;
        private readonly DbSet<Item> _dbSet;
        public MatchingService(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<Item>();
        }
        public async Task<List<Item>> FindPotentialMatchesAsync(Item item)
        {
            var oppositeType = item.Type == ItemType.Found
                ? ItemType.Lost
                : ItemType.Found;
            var candidates = await _dbSet
                .Include(i => i.CreatedByUser)
                .Where(i =>
                    i.Id != item.Id &&
                    i.Type == oppositeType &&
                    i.Status == ItemStatus.Open &&
                    i.Category == item.Category)
                .ToListAsync();
            var itemKeywords = ExtractKeywords(
                $"{item.Title} {item.Description}");
            var matches = candidates
                .Select(candidate =>
                {
                    var candidateKeywords = ExtractKeywords(
                        $"{candidate.Title} {candidate.Description}");
                    var score = CalculateSimilarity(
                        itemKeywords,
                        candidateKeywords);
                    if (!string.IsNullOrWhiteSpace(item.Location) &&
                        !string.IsNullOrWhiteSpace(candidate.Location))
                    {
                        if (item.Location.Contains(candidate.Location, StringComparison.OrdinalIgnoreCase) ||
                            candidate.Location.Contains(item.Location, StringComparison.OrdinalIgnoreCase))
                        {
                            score += 3;
                        }
                    }
                    return new
                    {
                        Item = candidate,
                        Score = score
                    };
                })
                .Where(x => x.Score > 0)
                .OrderByDescending(x => x.Score)
                .Take(5)
                .Select(x => x.Item)
                .ToList();

            return matches;
        }
        private static HashSet<string> ExtractKeywords(string text)
        {
            return text
                .ToLowerInvariant()
                .Split(
                    new[]
                    {
                        ' ',
                        ',',
                        '.',
                        '-',
                        '_',
                        '/',
                        '\\',
                        '!',
                        '?',
                        ':',
                        ';',
                        '(',
                        ')',
                        '[',
                        ']'
                    },
                    StringSplitOptions.RemoveEmptyEntries)
                .Where(word => word.Length > 2)
                .ToHashSet();
        }
        private static int CalculateSimilarity(
            HashSet<string> setA,
            HashSet<string> setB)
        {
            return setA.Intersect(setB).Count();
        }
    }
}