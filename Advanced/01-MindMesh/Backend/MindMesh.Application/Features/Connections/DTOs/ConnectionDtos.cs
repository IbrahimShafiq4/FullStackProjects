using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Connections.DTOs
{
    public record ConnectionDto(int Id, int FromCardId, int ToCardId, string Color);
    public record CreateConnectionRequest(int BoardId, int FromCardId, int ToCardId, string Color);
}
