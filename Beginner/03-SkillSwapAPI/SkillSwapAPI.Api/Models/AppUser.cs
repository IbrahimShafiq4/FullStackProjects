namespace SkillSwapAPI.Api.Models
{
    public class AppUser: BaseEntity
    {
        // --- اسم المستخدم --- //
        public string                   FullName        { get; set; } = string.Empty;

        // --- صورة الشخص --- // 
        public string?                  ProfilePicture  { get; set; }

        // --- UserSkill --- //
        public ICollection<UserSkill>   UserSkills      { get; set; } = new List<UserSkill>();
    }
}
