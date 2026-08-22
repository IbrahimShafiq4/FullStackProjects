using System;
using System.Collections.Generic;
using System.Text;

namespace GigLink.Application.DTOs.Proposals
{
    public class ProposalDto
    {
        public int Id                       { get; set; }
        public decimal  ProposedPrice       { get; set; }
        public int      DeliveryDays        { get; set; }
        public string   Message             { get; set; } = string.Empty;
        public string   Status              { get; set; } = string.Empty;
        public string   FreelancerName      { get; set; } = string.Empty;
    }
}
