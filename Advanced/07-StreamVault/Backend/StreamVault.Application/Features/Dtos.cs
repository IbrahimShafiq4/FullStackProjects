namespace StreamVault.Application.Features
{
    public record RegisterDto(string FullName, string Email, string Password);
    public record RegisterTeacherDto(string FullName, string Email, string Password, string InviteCode);
    public record LoginDto(string Email, string Password);
    public record CurrentUserDto(string Id, string FullName, string Email, string Role);

    public record CourseDto(int Id, string Title, string Description, string InstructorName, int VideoCount, int ClassroomNumber, string Status, int? FloorId);
    public record CreateCourseDto(string Title, string Description, int FloorId, int ClassroomNumber);
    public record UpdateCourseDto(string Title, string Description);

    public record VideoDto(int Id, string Title, int Order);
    public record CreateVideoDto(string Title, int Order);

    public record WatchProgressDto(int VideoId, int LastPositionSeconds);

    public record CreateLiveSessionDto(int CourseId, string Title);
    public record LiveSessionDto(int Id, string Title, string Status, DateTime? StartedAt);

    public record CheckoutDto(int Purpose, int? CourseId, int? StudyFileId);
    public record PaymentDto(int Id, string Description, decimal Amount, string Currency, int Status, int Purpose, string? TeacherName, string? CourseTitle, string? StudyFileName, DateTime CreatedAt, DateTime? CompletedAt);

    public record CreateReviewDto(int TargetType, int TargetId, int Rating, string Comment);
    public record ReviewDto(int Id, string AuthorName, int Rating, string Comment, DateTime CreatedAt);
    public record RatingSummaryDto(double AverageRating, int TotalReviews);

    public record CreateStudyFileDto(string Title, string Description, decimal Price, bool IsFree, int CourseId);
    public record StudyFileDto(int Id, string Title, string Description, string OriginalFileName, string ContentType, long FileSizeBytes, decimal Price, bool IsFree, int CourseId, string CourseTitle, string TeacherName, DateTime CreatedAt);

    public record TeacherStatisticsDto(decimal TotalEarnings, int TotalStudents, int TotalCourses, double AverageRating, int TotalReviews, string? TopCourseTitle, int TopCourseSales, List<MonthlyEarningDto> MonthlyEarnings);
    public record MonthlyEarningDto(string Month, decimal Amount, int SalesCount);

    public record TeacherWalletDto(int Id, string Provider, string WalletNumber, string AccountName, string Instructions, bool IsDefault);
    public record SaveTeacherWalletDto(string Provider, string WalletNumber, string AccountName, string Instructions, bool IsDefault);
    public record CheckPurchaseResponse(bool HasPurchased);
    public record CheckSubscriptionResponse(bool IsActive);
    public record PaymentDetailDto(
    int Id,
    string Description,
    decimal Amount,
    string Currency,
    int Status,
    int Purpose,
    string? TeacherId,
    string? TeacherName,
    int? CourseId,
    int? StudyFileId);
}