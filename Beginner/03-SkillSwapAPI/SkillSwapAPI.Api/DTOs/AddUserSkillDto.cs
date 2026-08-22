namespace SkillSwapAPI.Api.DTOs
{
    public class AddUserSkillDto
    {
        public int AppUserId { get; set; }
        public int SkillId { get; set; }
        public Models.SkillLevel Level { get; set; } = Models.SkillLevel.Beginner;
    }
}
