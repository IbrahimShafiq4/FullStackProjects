using AutoMapper;
using GigLink.Application.DTOs.Gigs;
using GigLink.Application.DTOs.Proposals;
using GigLink.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GigLink.Application.Mappings
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<Gig, GigDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.ClientName, opt => opt.MapFrom(src => src.Client.FullName.ToString()))
                .ForMember(dest => dest.ClientId, opt => opt.MapFrom(src => src.Client.Id.ToString()));

            CreateMap<Proposal, ProposalDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.FreelancerName, opt => opt.MapFrom(src => src.Freelancer.FullName.ToString()));
        }
    }
}
