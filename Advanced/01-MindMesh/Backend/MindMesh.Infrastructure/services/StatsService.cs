using Microsoft.EntityFrameworkCore;
using MindMesh.Application.Features.Stats;
using MindMesh.Application.Features.Users.DTOs;
using MindMesh.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Infrastructure.services
{
    public class StatsService : IStatsService
    {
        private readonly IAppDbContext _context;

        public StatsService(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<OverviewStatsDto> GetOverviewStatsAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalBoards = await _context.Boards.CountAsync();
            var totalCards = await _context.Cards.CountAsync();

            return new OverviewStatsDto(totalUsers, totalBoards, totalCards, DateTime.UtcNow);
        }

        public async Task<UserDetailsDto> GetUserDetailsAsync(string userId)
        {
            var user = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.CreatedAt,
                    Boards = u.Boards.Select(b => new
                    {
                        b.Id,
                        b.Title,
                        b.CreatedAt,
                        CardsCount = b.Cards.Count
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (user is null) return null!;

            var totalCards = user.Boards.Sum(b => b.CardsCount);
            var lastActivity = user.Boards.Any() ? user.Boards.Max(b => b.CreatedAt) : user.CreatedAt;
            var recentBoards = user.Boards
                .OrderByDescending(b => b.CreatedAt)
                .Take(5)
                .Select(b => new BoardSummaryDto(b.Id, b.Title, b.CreatedAt, b.CardsCount))
                .ToList();

            return new UserDetailsDto(
                user.Id,
                user.FullName,
                user.Email!,
                user.CreatedAt,
                user.Boards.Count,
                totalCards,
                lastActivity,
                recentBoards
            );
        }
    }
}
