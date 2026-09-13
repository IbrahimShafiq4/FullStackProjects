using MediatR;
using Microsoft.EntityFrameworkCore;
using MindMesh.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Cards.Queries
{
    public class GetCardDetailsHandler: IRequestHandler<GetCardDetailsQuery, CardDetailsDto?>
    {
        private readonly IAppDbContext _context;

        public GetCardDetailsHandler(IAppDbContext context)
        { _context = context; }

        public async Task<CardDetailsDto?> Handle(GetCardDetailsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Cards
                .Where(c => c.Id == request.CardId)
                .Select(c => new CardDetailsDto(c.Id, c.Content, c.PositionX, c.PositionY, c.Color, c.Board.Title, c.Board.CreatedAt))
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
