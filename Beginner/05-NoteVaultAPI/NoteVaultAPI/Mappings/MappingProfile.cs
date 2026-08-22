using AutoMapper;
using NoteVaultAPI.DTOs.NoteDto;
using NoteVaultAPI.Models;

namespace NoteVaultAPI.Mappings
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<Note, NoteDto>().ReverseMap();
        }
    }
}
