using MediatR;
using MindMesh.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Connections.Commands
{
    public class DeleteConnectionHandler : IRequestHandler<DeleteConnectionCommand, bool>
    {
        private readonly IAppDbContext _context;

        public DeleteConnectionHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteConnectionCommand request, CancellationToken cancellationToken)
        {
            var connection = await _context.Connections.FindAsync(new object[] { request.ConnectionId }, cancellationToken);
            if (connection is null) return false;

            _context.Connections.Remove(connection);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
