using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Users.DTOs
{
    public record UserDetailsDto(
        string Id,
        string FullName,
        string Email,
        DateTime CreatedAt,
        int BoardsCount,
        int CardsCount,
        DateTime LastActivity,
        List<BoardSummaryDto> RecentBoards
    );

    public record BoardSummaryDto(
        int Id,
        string Title,
        DateTime CreatedAt,
        int CardsCount
    );
}
