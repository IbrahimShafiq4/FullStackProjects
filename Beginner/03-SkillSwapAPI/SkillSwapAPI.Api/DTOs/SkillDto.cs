namespace SkillSwapAPI.Api.DTOs
{
    public class SkillDto
    {
        public int      Id      { get; set; }
        public string   Name    { get; set; } = string.Empty;
        public string?  IconUrl { get; set; }
    }
}
