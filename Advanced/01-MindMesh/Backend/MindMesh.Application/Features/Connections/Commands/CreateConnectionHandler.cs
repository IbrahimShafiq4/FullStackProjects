using MediatR;
using Microsoft.EntityFrameworkCore;
using MindMesh.Application.Interfaces;
using MindMesh.Domain.Entities;

namespace MindMesh.Application.Features.Connections.Commands
{
    //public record CreateConnectionCommand(int BoardId, int FromCardId, int ToCardId, string Color) : IRequest<int>;

    public class CreateConnectionHandler : IRequestHandler<CreateConnectionCommand, int>
    {
        private readonly IAppDbContext _context;

        public CreateConnectionHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(
            CreateConnectionCommand request,
            CancellationToken ct)
        {
            var cards = await _context.Cards
                .Where(c =>
                    c.BoardId == request.BoardId &&
                    (c.Id == request.FromCardId || c.Id == request.ToCardId))
                .Select(c => c.Id)
                .ToListAsync(ct);

            if (!cards.Contains(request.FromCardId))
                throw new KeyNotFoundException($"From card {request.FromCardId} was not found.");

            if (!cards.Contains(request.ToCardId))
                throw new KeyNotFoundException($"To card {request.ToCardId} was not found.");

            if (request.FromCardId == request.ToCardId)
                throw new InvalidOperationException("A card cannot be connected to itself.");

            var connection = new CardConnection
            {
                BoardId = request.BoardId,
                FromCardId = request.FromCardId,
                ToCardId = request.ToCardId,
                Color = request.Color
            };

            _context.Connections.Add(connection);

            await _context.SaveChangesAsync(ct);

            return connection.Id;
        }
    }
}