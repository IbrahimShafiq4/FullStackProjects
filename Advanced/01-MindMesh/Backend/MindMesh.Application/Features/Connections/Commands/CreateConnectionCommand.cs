using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Connections.Commands
{
    public record CreateConnectionCommand(int BoardId, int FromCardId, int ToCardId, string Color) : IRequest<int>;
}
