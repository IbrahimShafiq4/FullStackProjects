using MediatR;
using Microsoft.EntityFrameworkCore;
using MindMesh.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Diagnostics.Tracing;
using System.Text;

namespace MindMesh.Application.Features.Boards.Queries
{
    public class GetBoardAnalyticsHandler: IRequestHandler<GetBoardAnalyticsQuery, BoardAnalyticsDto>
    {
        private readonly IAppDbContext _context;

        public GetBoardAnalyticsHandler(IAppDbContext context)
        { _context = context; }

        public async Task<BoardAnalyticsDto> Handle(GetBoardAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var cards = await _context.Cards
                                      .Where(c => c.BoardId == request.BoardId)
                                      .ToListAsync(cancellationToken);
            var connectionsCount = await _context.Connections.CountAsync(c => c.BoardId == request.BoardId, cancellationToken);

            var mostUsedColors = cards.GroupBy(c => c.Color)
                                      .OrderByDescending(g => g.Count())
                                      .Select(g => g.Key)
                                      .FirstOrDefault() ?? "لا يوجد";

            return new BoardAnalyticsDto(cards.Count, connectionsCount, mostUsedColors, DateTime.UtcNow);
        }
    }
}
