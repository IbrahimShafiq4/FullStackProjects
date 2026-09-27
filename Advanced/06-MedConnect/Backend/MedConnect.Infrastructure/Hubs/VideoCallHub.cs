using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Text;

namespace MedConnect.Infrastructure.Hubs
{
    public class VideoCallHub: Hub
    {
        public async Task JoinAppointment(string appointmentId) =>
            await Groups.AddToGroupAsync(Context.ConnectionId, $"appointment-{appointmentId}");

        public async Task SendOffer(string targetConnectionId, string offer) =>
            await Clients.Client(targetConnectionId).SendAsync("ReceiveOffer", Context.ConnectionId, offer);

        public async Task SendAnswer(string targetConnectionId, string answer) =>
            await Clients.Client(targetConnectionId).SendAsync("ReceiveAnswer", Context.ConnectionId, answer);

        public async Task SendIceCandidate(string targetConnectionId, string candidate) =>
            await Clients.Client(targetConnectionId).SendAsync("ReceiveIceCandidate", Context.ConnectionId, candidate);
    }
}
