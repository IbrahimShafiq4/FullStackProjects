using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Connections.Commands
{
    public record DeleteConnectionCommand(int ConnectionId) : IRequest<bool>;
}
