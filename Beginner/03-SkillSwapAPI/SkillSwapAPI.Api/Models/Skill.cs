namespace SkillSwapAPI.Api.Models
{
    public class Skill: BaseEntity
    {
        // --- اسم المهارة --- //
        public string                   Name            { get; set; } = string.Empty;

        // --- ايقون للمهارة -- //
        public string?                  IconUrl         { get; set; }

        // --- علاقة ما بين ال Skill, و ال AppUser --- //
        // --- نوع العلاقة هى Explicit Join Entity --- //
        public ICollection<UserSkill>   UserSkills      { get; set; } = new List<UserSkill>();
    }
}
