using AutoMapper;
using MomentoAPI.DTOs.Memories;
using MomentoAPI.Models;

namespace MomentoAPI.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Memory, MemoryDto>().ReverseMap()
                .ForMember( dest => dest.MediaType, 
                            opt => opt.MapFrom(src => src.MediaType.ToString()));
        }
    }
}
