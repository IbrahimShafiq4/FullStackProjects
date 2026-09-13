using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Domain.Entities
{
    public class Board
    {
        public int                  Id          { get; set; }
        public string               Title       { get; set; } = string.Empty;
        public DateTime             CreatedAt   { get; set; } = DateTime.UtcNow;

        public string               OwnerId     { get; set; } = string.Empty;
        public AppUser              Owner       { get; set; } = null!;
        public List<Card>           Cards       { get; set; } = new();
        public List<CardConnection> Connections { get; set; } = new();
    }
}
