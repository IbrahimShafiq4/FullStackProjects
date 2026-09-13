using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace PropVista.API.Hubs
{
    [Authorize]
    public class VideoCallHub : Hub
    {
        public async Task JoinCall(string viewingId)
        {
            var groupName = $"viewing-{viewingId}";

            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                groupName);

            await Clients.OthersInGroup(groupName)
                .SendAsync(
                    "PeerJoined",
                    Context.ConnectionId);
        }

        public async Task SendOffer(
            string targetConnectionId,
            string offer)
        {
            await Clients.Client(targetConnectionId)
                .SendAsync(
                    "ReceiveOffer",
                    Context.ConnectionId,
                    offer);
        }

        public async Task SendAnswer(
            string targetConnectionId,
            string answer)
        {
            await Clients.Client(targetConnectionId)
                .SendAsync(
                    "ReceiveAnswer",
                    Context.ConnectionId,
                    answer);
        }

        public async Task SendIceCandidate(
            string targetConnectionId,
            string candidate)
        {
            await Clients.Client(targetConnectionId)
                .SendAsync(
                    "ReceiveIceCandidate",
                    Context.ConnectionId,
                    candidate);
        }
    }
}