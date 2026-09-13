using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Cards.Commands
{
    public record DeleteCardComman(int CardId) : IRequest<bool>;
}
