using GigLink.Application.DTOs.Proposals;
using System;
using System.Collections.Generic;
using System.Text;

namespace GigLink.Application.DTOs.Gigs
{
    public class GigDto
    {
        public int                  Id          { get; set; }
        public string               Title       { get; set; } = string.Empty;
        public string               Description { get; set; } = string.Empty;
        public decimal              Budget      { get; set; }
        public string               Status      { get; set; } = string.Empty;
        public string               ClientName  { get; set; } = string.Empty;
        public string               ClientId    { get; set; } = string.Empty;
        public DateTime             CreatedAt   { get; set; }
        public List<ProposalDto>    Proposals   { get; set; } = [];
    }
}
