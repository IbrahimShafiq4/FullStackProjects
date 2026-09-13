using System;
using System.Collections.Generic;
using System.Text;

namespace MindMesh.Domain.Entities
{
    public class CardConnection
    {
        public int      Id          { get; set; }
        public int      BoardId     { get; set; }
        public Board    Board       { get; set; } = null!;

        public int      FromCardId  { get; set; }
        public Card     FromCard    { get; set; } = null!;

        public int      ToCardId    { get; set; }
        public Card     ToCard      { get; set; } = null!;

        public string   Color       { get; set; } = "#94a3b8";
    }
}
