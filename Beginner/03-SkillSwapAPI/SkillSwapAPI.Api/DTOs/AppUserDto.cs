namespace SkillSwapAPI.Api.DTOs
{
    public class AppUserDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? ProfilePicture { get; set; }
        public List<UserSkillDto> UserSkills { get; set; } = new();
    }
}
