using AutoMapper;
using PulseBoardAPI.DTOs.Entries;
using PulseBoardAPI.Models;

namespace PulseBoardAPI.Mappings
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        { CreateMap<PulseEntry, EntryDto>().ReverseMap(); }
    }
}
