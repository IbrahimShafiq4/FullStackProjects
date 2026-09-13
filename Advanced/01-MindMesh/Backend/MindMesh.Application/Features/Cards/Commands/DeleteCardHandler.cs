using MediatR;
using Microsoft.EntityFrameworkCore;
using MindMesh.Application.Interfaces;

namespace MindMesh.Application.Features.Cards.Commands
{
    public class DeleteCardHandler : IRequestHandler<DeleteCardComman, bool>
    {
        private readonly IAppDbContext _context;

        public DeleteCardHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(
            DeleteCardComman request,
            CancellationToken cancellationToken)
        {
            var card = await _context.Cards
                .FirstOrDefaultAsync(c => c.Id == request.CardId, cancellationToken);

            if (card is null)
                return false;

            var connections = await _context.Connections
                .Where(c =>
                    c.FromCardId == request.CardId ||
                    c.ToCardId == request.CardId)
                .ToListAsync(cancellationToken);

            _context.Connections.RemoveRange(connections);
            _context.Cards.Remove(card);

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}