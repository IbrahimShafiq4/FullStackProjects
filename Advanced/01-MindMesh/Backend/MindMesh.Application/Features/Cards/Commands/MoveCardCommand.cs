using MediatR;
using MindMesh.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Cards.Commands
{
    public record MoveCardCommand(int CardId, double NewX, double NewY) : IRequest<bool>;

    public class MoveCardHandler: IRequestHandler<MoveCardCommand, bool>
    {
        private readonly IAppDbContext _context;
        public MoveCardHandler(IAppDbContext context)
        { _context = context; }

        public async Task<bool> Handle(MoveCardCommand request, CancellationToken cancellationToken)
        {
            var card = await _context.Cards.FindAsync(new object[] { request.CardId }, cancellationToken);
            if (card is null) return false;

            card.PositionX = request.NewX;
            card.PositionY = request.NewY;

            await _context.SaveChangesAsync(cancellationToken);
            return true;

        }
    }
}
