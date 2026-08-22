using Microsoft.AspNetCore.SignalR;

namespace VideoPlatformApi.Api.Hubs
{
    public class VideoHub : Hub
    {
        public async Task NotifyNewVideo(string videoTitle, string username) =>
            await Clients.All.SendAsync("NewVideoUploaded", new
            {
                Title = videoTitle,
                username = username,
                TimeStamp = DateTime.UtcNow
            });

        public async Task UpdateViews(int videoId, int views) =>
            await Clients.All.SendAsync("ViewsUpdated", new
            {
                VideoId = videoId,
                Views = views
            });

        public async Task NotifyNewComment(int videoId, int username, string comment) =>
            await Clients.All.SendAsync("NewComment", new
            {
                VideoId = videoId,
                Username = username,
                comment = comment,
                Timestamp = DateTime.UtcNow
            });

        public async Task NotifyLikeChange(int videoId, int likes) =>
            await Clients.All.SendAsync("LikesUpdated", new
            {
                VideoId = videoId,
                Likes = likes
            });

        public async Task JoinVideoGroup(int videoId) =>
            await Groups.AddToGroupAsync(Context.ConnectionId, $"video-{videoId}");

        public async Task LeaveVideoGroup(int videoId) =>
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"video-{videoId}");

        public async Task NotifyNewCommentToGroup(int videoId, string username, string comment) =>
            await Clients.Group($"video-{videoId}").SendAsync("NewComment", new
            {
                VideoId = videoId,
                Username = username,
                Comment = comment,
                Timestamp = DateTime.UtcNow
            });

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("Connected", "تم الاتصال بـ Video Hub");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await Clients.Caller.SendAsync("Disconnected", "تم قطع الاتصال بـ Video Hub");
            await base.OnDisconnectedAsync(exception);
        }
    }
}
