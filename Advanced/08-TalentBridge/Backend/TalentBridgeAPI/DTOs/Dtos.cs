namespace TalentBridgeAPI.DTOs
{
    public record RegisterDto       (string FullName, string Email, string Password, string Role);
    public record LoginDto          (string Email, string Password);

    public record CreateJobDto      (string Title, string Description, List<CreateSkillReqDto> RequiredSkills);
    public record CreateSkillReqDto (string SkillName, string Importance);
    public record JobDto            (int Id, string Title, string Description, string EmployerName, List<string> MustHaveSkills, List<string> NiceToHaveSkills);

    public record UpdateProfileDto  (string Bio, List<string> Skills);
    public record ApplicationDto    (int Id, string CandidateName, double MatchScore, string Status, DateTime AppliedAt);
    public record NotificationDto   (int Id, string Message, bool IsRead, DateTime CreatedAt);
}
