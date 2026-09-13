using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace ChatterHub.API.Hubs
{
    public class RoomHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> UserRooms = new();

        public async Task JoinRoom(string roomId)
        {
            UserRooms[Context.ConnectionId] = roomId;

            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                $"room-{roomId}"
            );

            await Clients.OthersInGroup($"room-{roomId}")
                .SendAsync("UserJoined", Context.ConnectionId);
        }

        public async Task GetRoomUsers(string roomId)
        {
            var users = UserRooms
                .Where(x => x.Value == roomId)
                .Select(x => x.Key)
                .Where(x => x != Context.ConnectionId)
                .ToList();

            await Clients.Caller.SendAsync("RoomUsers", users);
        }

        public async Task SendOffer(string targetConnectionId, string offer)
        {
            await Clients.Client(targetConnectionId)
                .SendAsync(
                    "ReceiveOffer",
                    Context.ConnectionId,
                    offer
                );
        }

        public async Task SendAnswer(string targetConnectionId, string answer)
        {
            await Clients.Client(targetConnectionId)
                .SendAsync(
                    "ReceiveAnswer",
                    Context.ConnectionId,
                    answer
                );
        }

        public async Task SendIceCandidate(
            string targetConnectionId,
            string candidate)
        {
            await Clients.Client(targetConnectionId)
                .SendAsync(
                    "ReceiveIceCandidate",
                    Context.ConnectionId,
                    candidate
                );
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            UserRooms.TryRemove(Context.ConnectionId, out _);
            await base.OnDisconnectedAsync(exception);
        }
    }
}