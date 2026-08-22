namespace SkillSwapAPI.Api.Models
{
    // دا "عقد رسمى" يعنى زى ما تقول Offical contract
    // ما بين ال AppUser, SkillLevel
    // مش عايز استخدم ال Impclicit Join Entity
    // اللى EF Core بيعمله اوتوماتيك
    // علشان لما اكون عايز اضيف بيانات اضافية فى ال Join Entity

    public class UserSkill: BaseEntity
    {
        // --- ال Id اللى هيتورث هنا هو عبارة عن PK و ليس Composite PK --- //

        // --- ال Foreign Key اللى هيربط ما بين ال UserSkill, وال AppUser --- //
        public int          AppUserId       { get; set; }
        public AppUser      AppUser         { get; set; } = null!;

        // --- ال Foreign Key اللى هيربط ما بين ال UserSkill, وال Skill --- //
        public int          SkillId         { get; set; }
        public Skill        Skill           { get; set; } = null!;

        // --- دول ال Extra Data اللى انا عايز اضيفها فى ال Join Entity --- //
        public SkillLevel   Level           { get; set; } = SkillLevel.Beginner;
        public DateTime     AquiredAt       { get; set; } = DateTime.UtcNow;

    }
}