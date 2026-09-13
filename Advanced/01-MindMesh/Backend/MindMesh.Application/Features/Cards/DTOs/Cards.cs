using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Cards.DTOs
{
    public record CreateCardRequest (int BoardId, string Content, double X, double Y, string Color);
    public record MoveCardRequest   (int CardId, double X, double Y);
}
