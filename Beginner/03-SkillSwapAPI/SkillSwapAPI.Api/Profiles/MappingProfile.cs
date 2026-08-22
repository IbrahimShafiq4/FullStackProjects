using AutoMapper;
using SkillSwapAPI.Api.DTOs;

namespace SkillSwapAPI.Api.Profiles
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<Skill, SkillDto>();
            CreateMap<CreateSkillDto, Skill>();

            CreateMap<UserSkill, UserSkillDto>()
                .ForMember(dest => dest.SkillName, opt => opt.MapFrom(src => src.Skill.Name))
                .ForMember(dest => dest.Level, opt => opt.MapFrom(src => src.Level.ToString()));

            CreateMap<AppUser, AppUserDto>();
            CreateMap<CreateAppUserDto, AppUser>();
        }
    }
}
