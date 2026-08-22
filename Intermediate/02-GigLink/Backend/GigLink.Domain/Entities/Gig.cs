using GigLink.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace GigLink.Domain.Entities
{
    public class Gig
    {
        public int              Id          { get; set; }
        public string           Title       { get; set; } = string.Empty;
        public string           Description { get; set; } = string.Empty;
        public decimal          Budget      { get; set; }
        public GigStatus        Status      { get; set; } = GigStatus.Open;
        public DateTime         CreatedAt   { get; set; } = DateTime.UtcNow;

        public string           ClientId    { get; set; } = string.Empty;
        public AppUser          Client      { get; set; } = null!;

        public List<Proposal>   Proposals   { get; set; } = new();

    }
}
