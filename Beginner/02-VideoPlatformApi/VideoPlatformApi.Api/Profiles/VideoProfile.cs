using AutoMapper;
using VideoPlatformApi.Api.DTOs;
using VideoPlatformApi.Api.Models;
using VideoPlatformApi.Models;

namespace VideoPlatformApi.Api.Profiles
{
    public class VideoProfile: Profile
    {
        public VideoProfile()
        {
            CreateMap<Video, VideoDto>()
                 .ForMember(dest => dest.Username,
                     opt => opt.MapFrom(src => src.User != null ? src.User.Username : "Unknown"))
                 .ForMember(dest => dest.CommentCount,
                     opt => opt.Ignore())
                 .ForMember(dest => dest.LikesCount,
                     opt => opt.Ignore());

            CreateMap<Video, VideoDetailDto>()
                .ForMember(dest => dest.Username,
                    opt => opt.MapFrom(src => src.User != null ? src.User.Username : "Unknown"))
                .ForMember(dest => dest.CommentCount,
                    opt => opt.Ignore())
                .ForMember(dest => dest.LikeCount,
                    opt => opt.Ignore())
                .ForMember(dest => dest.Comments,
                    opt => opt.Ignore());

            CreateMap<Comment, CommentDto>()
                .ForMember(dest => dest.Username,
                    opt => opt.MapFrom(src => src.User != null ? src.User.Username : "Unknown"))
                .ForMember(dest => dest.ProfilePictureUrl,
                    opt => opt.MapFrom(src => src.User != null ? src.User.ProfilePictureUrl : null));

            CreateMap<User, UserDto>()
                .ForMember(dest => dest.VideoCount,
                    opt => opt.MapFrom(src => src.Videos.Count));
        }
    }
}
