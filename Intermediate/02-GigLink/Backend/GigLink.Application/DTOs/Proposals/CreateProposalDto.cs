using System;
using System.Collections.Generic;
using System.Text;

namespace GigLink.Application.DTOs.Proposals
{
    public class CreateProposalDto
    {
        public decimal  ProposedPrice   { get; set; }
        public int      DeliveryDays    { get; set; }
        public string   Message         { get; set; } = string.Empty;
    }
}
