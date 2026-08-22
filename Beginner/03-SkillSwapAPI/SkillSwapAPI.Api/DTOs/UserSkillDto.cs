namespace SkillSwapAPI.Api.DTOs
{
    public class UserSkillDto
    {
        public int Id { get; set; }
        public string       SkillName   { get; set; } = string.Empty;
        public SkillLevel   Level       { get; set; }
        public DateTime     AquiredAt   { get; set; }
    }
}
