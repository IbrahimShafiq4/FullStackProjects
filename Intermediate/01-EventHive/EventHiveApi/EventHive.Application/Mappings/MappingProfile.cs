using AutoMapper;
using EventHive.Application.DTOs.Events;
using EventHive.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace EventHive.Application.Mappings
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<Event, EventDto>()
                .ForMember(dest => dest.AvailableSpots,
                    opt => opt.MapFrom(src => src.Capcity - src.Rsvps.Count(r => r.IsConfirmed))
                )
                .ForMember(dest => dest.OrganizerName,
                    opt => opt.MapFrom(src => src.Organizer.FullName)
                );

            CreateMap<CreateEventDto, Event>();

            CreateMap<UpdateEventDto, Event>()
                .ForAllMembers(opt => opt.Condition((src, desc, srcMember) => srcMember != null));

            CreateMap<Rsvp, RsvpDto>()
                .ForMember(dest => dest.AttendeeName, opt => opt.MapFrom(src => src.Attendee.FullName));
        }
    }
}
