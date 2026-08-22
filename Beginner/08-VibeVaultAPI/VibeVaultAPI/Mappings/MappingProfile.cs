using AutoMapper;
using VibeVaultAPI.DTOs.Vibes;
using VibeVaultAPI.Models;

namespace VibeVaultAPI.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<VibeItem, VibeItemDto>()
                .ForMember(
                    dest => dest.MediaType,
                    opt => opt.MapFrom(src => src.MediaType.ToString())
                )
                .ForMember(
                    dest => dest.Tag,
                    opt => opt.MapFrom(src => src.Tag.ToString())
                )
                .ForMember(
                    dest => dest.TagEmoji,
                    opt => opt.MapFrom(src =>
                        src.Tag == VibeTag.Cozy         ? "🌿" :
                        src.Tag == VibeTag.Chaotic      ? "🔥" :
                        src.Tag == VibeTag.Nostalgic    ? "🌌" :
                        src.Tag == VibeTag.Futuristic   ? "🚀" :
                        src.Tag == VibeTag.Calm         ? "🌊" :
                        src.Tag == VibeTag.MindBlown    ? "🤯" :
                        "❓"
                    )
                );

        }
    }
}