using MediatR;
using Microsoft.EntityFrameworkCore;
using MindMesh.Application.Features.Connections.DTOs;
using MindMesh.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Connections.Queries
{
    public class GetBoardConnectionsHandler : IRequestHandler<GetBoardConnectionsQuery, List<ConnectionDto>>
    {
        private readonly IAppDbContext _context;

        public GetBoardConnectionsHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ConnectionDto>> Handle(GetBoardConnectionsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Connections
                .Where(c => c.BoardId == request.BoardId)
                .Select(c => new ConnectionDto(c.Id, c.FromCardId, c.ToCardId, c.Color))
                .ToListAsync(cancellationToken);
        }
    }
}
