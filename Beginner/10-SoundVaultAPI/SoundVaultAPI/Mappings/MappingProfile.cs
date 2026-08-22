using AutoMapper;
using SoundVaultAPI.DTOs.Sounds;
using SoundVaultAPI.Models;

namespace SoundVaultAPI.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<SoundItem, SoundItemDto>()
                .ForMember(
                    dest => dest.MediaType,
                    opt => opt.MapFrom(src => src.MediaType.ToString())
                )
                .ForMember(
                    dest => dest.Category,
                    opt => opt.MapFrom(src => src.Category.ToString())
                )
                .ForMember(
                    dest => dest.CategoryEmoji,
                    opt => opt.MapFrom(src => GetCategoryEmoji(src.Category))
                );
        }

        private static string GetCategoryEmoji(SoundCategory category)
        {
            switch (category)
            {
                case SoundCategory.Calm:
                    return "🌊";

                case SoundCategory.Laughter:
                    return "😂";

                case SoundCategory.Music:
                    return "🎵";

                case SoundCategory.Nature:
                    return "🌿";

                case SoundCategory.Scream:
                    return "😱";

                case SoundCategory.Speech:
                    return "🗣️";

                default:
                    return "🎧";
            }
        }
    }
}