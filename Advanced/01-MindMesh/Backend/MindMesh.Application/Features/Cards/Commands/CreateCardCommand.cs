using MediatR;
using Microsoft.EntityFrameworkCore.Storage.Json;
using MindMesh.Application.Interfaces;
using MindMesh.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Cards.Commands
{
    public record CreateCardCommand(int BoardId, string Content, double x, double y, string color) : IRequest<int>;

    public class CreateCardHandler: IRequestHandler<CreateCardCommand, int>
    {
        private readonly IAppDbContext _context;

        public CreateCardHandler(IAppDbContext context)
        { _context = context; }

        public async Task<int> Handle(CreateCardCommand request, CancellationToken cancellationToken)
        {
            var card = new Card
            {
                BoardId = request.BoardId,
                Content = request.Content,
                PositionX = request.x,
                PositionY = request.y,
                Color = request.color
            };

            _context.Cards.Add(card);
            await _context.SaveChangesAsync(cancellationToken);
            return card.Id;
        }
    }
}
