using AutoMapper;
using CodeSnapAPI.DTOs.Snippets;
using CodeSnapAPI.Models;

namespace CodeSnapAPI.Mappings
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<Snippet, SnippetDto>()
                .ForMember(
                    dest => dest.Language, 
                    opt => opt
                    .MapFrom(
                        src => src.Language.ToString()));
        }
    }
}
