using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Domain.Entities
{
    public class Card
    {
        public int      Id          { get; set; }
        public string   Content     { get; set; } = string.Empty;
        public double   PositionX   { get; set; }
        public double   PositionY   { get; set; }
        public string   Color       { get; set; } = string.Empty;

        public int      BoardId     { get; set; }
        public Board    Board       { get; set; } = null!;
    }
}
