namespace TalentBridgeAPI.DTOs
{
    // Auth
    public record RegisterDto(string FullName, string Email, string Password, string Role);
    public record LoginDto(string Email, string Password);

    // Jobs
    public record CreateJobDto(
        string Title,
        string Description,
        string Location,
        string WorkMode,
        int? SalaryMin,
        int? SalaryMax,
        List<CreateSkillReqDto> RequiredSkills
    );
    public record CreateSkillReqDto(string SkillName, string Importance);

    public record JobDto(
        int Id,
        string Title,
        string Description,
        string Location,
        string WorkMode,
        int? SalaryMin,
        int? SalaryMax,
        string EmployerName,
        string EmployerId,
        DateTime CreatedAt,
        List<string> MustHaveSkills,
        List<string> NiceToHaveSkills
    );

    // Candidates
    public record UpdateProfileDto(string Bio, List<string> Skills);
    public record CandidateProfileDto(string UserId, string FullName, string Bio, List<string> Skills);

    // Applications
    public record ApplicationDto(
        int Id,
        string CandidateName,
        double MatchScore,
        string Status,
        DateTime AppliedAt
    );

    public record EmployerApplicationDto(
        int Id,
        string CandidateId,
        string CandidateName,
        string CandidateBio,
        List<string> CandidateSkills,
        double MatchScore,
        string Status,
        DateTime AppliedAt
    );

    public record MyApplicationDto(
        int Id,
        int JobId,
        string JobTitle,
        string EmployerName,
        double MatchScore,
        string Status,
        DateTime AppliedAt
    );

    // Notifications
    public record NotificationDto(int Id, string Message, bool IsRead, DateTime CreatedAt);
}