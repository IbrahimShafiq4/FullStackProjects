namespace VideoPlatformApi.Api.Services.LIkeServiceControl
{
    public interface ILikeService
    {
        Task<int> ToggleLikeAsync(int videoId, int userId);
        Task<bool> UserLikedVideoAsync(int videoId, int userId);
        Task<int> GetLikeCountAsync(int videoId);
    }
}
