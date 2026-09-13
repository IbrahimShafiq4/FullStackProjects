using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Stats
{
    public record OverviewStatsDto(
        int TotalUsers,
        int TotalBoards,
        int TotalCards,
        DateTime LastUpdated
    );
}
