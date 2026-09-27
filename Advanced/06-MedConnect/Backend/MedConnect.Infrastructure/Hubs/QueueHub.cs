using Microsoft.AspNetCore.SignalR;

namespace MedConnect.Infrastructure.Hubs
{
    public class QueueHub : Hub
    {
        public async Task JoinDoctorQueue(string doctorId) =>
            await Groups.AddToGroupAsync(Context.ConnectionId, $"queue-doctor-{doctorId}");

        public async Task LeaveDoctorQueue(string doctorId) =>
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"queue-doctor-{doctorId}");

        public async Task JoinPatientChannel(string patientId) =>
            await Groups.AddToGroupAsync(Context.ConnectionId, $"patient-{patientId}");
    }
}