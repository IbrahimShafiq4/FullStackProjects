using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Boards.Queries
{
    public record BoardAnalyticsDto(int TotalCards, int TotalConnections, string MostUsedColor, DateTime LastActivity);
    public record GetBoardAnalyticsQuery(int BoardId) : IRequest<BoardAnalyticsDto>;
}
