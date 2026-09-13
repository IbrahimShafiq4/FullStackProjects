using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Application.Features.Cards.Queries
{
    public record CardDetailsDto(int Id, string Content, double X, double Y, string Color, string BoardTitle, DateTime CreatedAt);
    public record GetCardDetailsQuery(int CardId) : IRequest<CardDetailsDto?>;
}
