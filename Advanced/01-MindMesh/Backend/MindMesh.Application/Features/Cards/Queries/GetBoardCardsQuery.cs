using MediatR;
using Microsoft.EntityFrameworkCore;
using MindMesh.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Cards.Queries
{
    public record CardDto(int Id, string content, double x, double y, string color);
    public record GetBoardCardsQuery(int BoardId) : IRequest<List<CardDto>>;

    public class GetBoardCardsHandler: IRequestHandler<GetBoardCardsQuery, List<CardDto>>
    {
        private readonly IAppDbContext _context;
        public GetBoardCardsHandler(IAppDbContext context)
        { _context = context; }

        public async Task<List<CardDto>> Handle(GetBoardCardsQuery request, CancellationToken cancellationToken) =>
            await _context.Cards
                    .Where(c => c.BoardId == request.BoardId)
                    .Select(c => new CardDto(c.Id, c.Content, c.PositionX, c.PositionY, c.Color))
                    .ToListAsync(cancellationToken);
    }
}
