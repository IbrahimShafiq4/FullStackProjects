using MediatR;
using MindMesh.Application.Features.Connections.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Connections.Queries
{
    public record GetBoardConnectionsQuery(int BoardId) : IRequest<List<ConnectionDto>>;
}
