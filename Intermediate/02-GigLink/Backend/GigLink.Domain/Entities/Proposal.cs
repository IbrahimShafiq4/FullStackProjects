using GigLink.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace GigLink.Domain.Entities
{
    public class Proposal
    {
        public int              Id              { get; set; }
        public decimal          ProposalPrice   { get; set; }
        public int              DeliveryDays    { get; set; }
        public string           Message         { get; set; } = string.Empty;
        public ProposalStatus   Status          { get; set; } = ProposalStatus.Pending;
        public DateTime         CreatedAt       { get; set; } = DateTime.UtcNow;

        public int              GigId           { get; set; }
        public Gig              Gig             { get; set; } = null!;

        public string           FreelancerId    { get; set; } = string.Empty;
        public AppUser          Freelancer      { get; set; } = null!;
    }
}
