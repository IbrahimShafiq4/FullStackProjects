using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using StreamVault.Application.Interfaces;
using StreamVault.Domain.Domain;
using StreamVault.Domain.Entities;
using System.Collections.Concurrent;

namespace StreamVault.Infrastructure.Hubs
{
    public record WhiteboardEvent(double X, double Y, bool IsNewStroke);
    public record ChatEvent(string SenderName, string Message, DateTime SentAt);
    public record ParticipantInfo(string ConnectionId, string UserName, bool IsInstructor);
    public record JoinRequestInfo(string ConnectionId, string UserName, bool HasPaid);

    [Authorize]
    public class LiveClassHub : Hub
    {
        private readonly IAppDbContext _context;

        private static readonly ConcurrentDictionary<string, List<WhiteboardEvent>> _WhiteboardHistory = new();
        private static readonly ConcurrentDictionary<string, List<ChatEvent>> _ChatHistory = new();
        private static readonly ConcurrentDictionary<string, List<ParticipantInfo>> _Participants = new();
        private static readonly ConcurrentDictionary<string, List<JoinRequestInfo>> _PendingRequests = new();
        private static readonly ConcurrentDictionary<string, HashSet<string>> _CameraOffUsers = new();

        public LiveClassHub(IAppDbContext context)
        {
            _context = context;
        }

        public async Task RequestJoin(string sessionId, string userName, bool isInstructor)
        {
            if (isInstructor)
            {
                await JoinSession(sessionId, userName, true);
                return;
            }

            bool hasPaid = false;

            if (int.TryParse(sessionId, out int sid))
            {
                var session = await _context.LiveSessions
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.Id == sid);

                if (session is not null)
                {
                    var studentId = Context.UserIdentifier ?? string.Empty;

                    hasPaid = await _context.Payments
                        .AsNoTracking()
                        .AnyAsync(p => p.StudentId == studentId
                                    && p.CourseId == session.CourseId
                                    && p.Status == PaymentStatus.Succeeded);
                }
            }

            var requests = _PendingRequests.GetOrAdd(sessionId, _ => new List<JoinRequestInfo>());
            lock (requests)
            {
                requests.RemoveAll(r => r.ConnectionId == Context.ConnectionId);
                requests.Add(new JoinRequestInfo(Context.ConnectionId, userName, hasPaid));
            }

            await Clients.Group($"session-{sessionId}")
                .SendAsync("JoinRequested", Context.ConnectionId, userName, hasPaid);
        }

        public async Task ApproveJoin(string sessionId, string requesterConnectionId)
        {
            var requests = _PendingRequests.GetOrAdd(sessionId, _ => new List<JoinRequestInfo>());
            lock (requests)
            {
                var request = requests.FirstOrDefault(r => r.ConnectionId == requesterConnectionId);
                if (request is not null) requests.Remove(request);
            }

            await Clients.Client(requesterConnectionId).SendAsync("JoinApproved");
        }

        public async Task RejectJoin(string sessionId, string requesterConnectionId)
        {
            var requests = _PendingRequests.GetOrAdd(sessionId, _ => new List<JoinRequestInfo>());
            lock (requests)
            {
                var request = requests.FirstOrDefault(r => r.ConnectionId == requesterConnectionId);
                if (request is not null) requests.Remove(request);
            }

            await Clients.Client(requesterConnectionId).SendAsync("JoinRejected");
        }

        public async Task ApproveAll(string sessionId)
        {
            var requests = _PendingRequests.GetOrAdd(sessionId, _ => new List<JoinRequestInfo>());
            List<JoinRequestInfo> snapshot;
            lock (requests)
            {
                snapshot = new List<JoinRequestInfo>(requests);
                requests.Clear();
            }

            foreach (var req in snapshot)
            {
                await Clients.Client(req.ConnectionId).SendAsync("JoinApproved");
            }

            await Clients.Group($"session-{sessionId}").SendAsync("AllRequestsApproved");
        }

        public async Task RejectAll(string sessionId)
        {
            var requests = _PendingRequests.GetOrAdd(sessionId, _ => new List<JoinRequestInfo>());
            List<JoinRequestInfo> snapshot;
            lock (requests)
            {
                snapshot = new List<JoinRequestInfo>(requests);
                requests.Clear();
            }

            foreach (var req in snapshot)
            {
                await Clients.Client(req.ConnectionId).SendAsync("JoinRejected");
            }

            await Clients.Group($"session-{sessionId}").SendAsync("AllRequestsRejected");
        }

        public async Task JoinSession(string sessionId, string userName, bool isInstructor)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"session-{sessionId}");

            var participants = _Participants.GetOrAdd(sessionId, _ => new List<ParticipantInfo>());
            List<ParticipantInfo> existing;
            lock (participants)
            {
                existing = new List<ParticipantInfo>(participants);
                participants.RemoveAll(p => p.ConnectionId == Context.ConnectionId);
                participants.Add(new ParticipantInfo(Context.ConnectionId, userName, isInstructor));
            }

            var cameraOffSet = _CameraOffUsers.GetOrAdd(sessionId, _ => new HashSet<string>());

            foreach (var p in existing)
            {
                bool isCamOff;
                lock (cameraOffSet) isCamOff = cameraOffSet.Contains(p.ConnectionId);
                await Clients.Caller.SendAsync("ParticipantJoined", p.ConnectionId, p.UserName, p.IsInstructor, true, isCamOff);
            }

            await Clients.OthersInGroup($"session-{sessionId}")
                .SendAsync("ParticipantJoined", Context.ConnectionId, userName, isInstructor, false, false);

            if (_WhiteboardHistory.TryGetValue(sessionId, out var drawEvents))
            {
                List<WhiteboardEvent> drawSnapshot;
                lock (drawEvents) drawSnapshot = new List<WhiteboardEvent>(drawEvents);
                foreach (var e in drawSnapshot)
                    await Clients.Caller.SendAsync("DrawEvent", e.X, e.Y, e.IsNewStroke);
            }

            if (_ChatHistory.TryGetValue(sessionId, out var chats))
            {
                List<ChatEvent> chatSnapshot;
                lock (chats) chatSnapshot = new List<ChatEvent>(chats);
                foreach (var c in chatSnapshot)
                    await Clients.Caller.SendAsync("NewChatMessage", c.SenderName, c.Message, c.SentAt);
            }
        }

        public async Task CameraToggled(string sessionId, bool isOff)
        {
            var cameraOffSet = _CameraOffUsers.GetOrAdd(sessionId, _ => new HashSet<string>());
            lock (cameraOffSet)
            {
                if (isOff) cameraOffSet.Add(Context.ConnectionId);
                else cameraOffSet.Remove(Context.ConnectionId);
            }

            await Clients.OthersInGroup($"session-{sessionId}")
                .SendAsync("ParticipantCameraToggled", Context.ConnectionId, isOff);
        }

        public async Task EndSession(string sessionId)
        {
            await Clients.Group($"session-{sessionId}").SendAsync("SessionEnded");
            _WhiteboardHistory.TryRemove(sessionId, out _);
            _ChatHistory.TryRemove(sessionId, out _);
            _Participants.TryRemove(sessionId, out _);
            _PendingRequests.TryRemove(sessionId, out _);
            _CameraOffUsers.TryRemove(sessionId, out _);
        }

        public async Task SendOffer(string targetConnectionId, string offer) =>
            await Clients.Client(targetConnectionId).SendAsync("ReceiveOffer", Context.ConnectionId, offer);

        public async Task SendAnswer(string targetConnectionId, string answer) =>
            await Clients.Client(targetConnectionId).SendAsync("ReceiveAnswer", Context.ConnectionId, answer);

        public async Task SendIceCandidate(string targetConnectionId, string candidate) =>
            await Clients.Client(targetConnectionId).SendAsync("ReceiveIceCandidate", Context.ConnectionId, candidate);

        public async Task RaiseHand(string sessionId, string studentName)
        {
            var hand = new RaisedHand
            {
                LiveSessionId = int.Parse(sessionId),
                StudentId = Context.UserIdentifier ?? string.Empty,
                StudentName = studentName,
                status = HandStatus.Pending
            };

            _context.RaisedHands.Add(hand);
            await _context.SaveChangesAsync();

            var sentAt = DateTime.UtcNow;
            var systemMessage = $"✋ {studentName} رفع إيده";

            var history = _ChatHistory.GetOrAdd(sessionId, _ => new List<ChatEvent>());
            lock (history) history.Add(new ChatEvent("النظام", systemMessage, sentAt));

            await Clients.Group($"session-{sessionId}")
                .SendAsync("HandRaised", Context.ConnectionId, studentName);

            await Clients.Group($"session-{sessionId}")
                .SendAsync("NewChatMessage", "النظام", systemMessage, sentAt);
        }

        public async Task LowerHand(string sessionId, string studentName)
        {
            var sentAt = DateTime.UtcNow;
            var systemMessage = $"👇 {studentName} نزّل إيده";

            var history = _ChatHistory.GetOrAdd(sessionId, _ => new List<ChatEvent>());
            lock (history) history.Add(new ChatEvent("النظام", systemMessage, sentAt));

            await Clients.Group($"session-{sessionId}")
                .SendAsync("HandLowered", Context.ConnectionId);

            await Clients.Group($"session-{sessionId}")
                .SendAsync("NewChatMessage", "النظام", systemMessage, sentAt);
        }

        public async Task ApproveHand(string sessionId, string studentConnectionId)
        {
            await UpdateHandStatus(int.Parse(sessionId), HandStatus.Approved);
            await Clients.Client(studentConnectionId).SendAsync("HandApproved");
        }

        public async Task RejectHand(string sessionId, string studentConnectionId)
        {
            await UpdateHandStatus(int.Parse(sessionId), HandStatus.Rejected);
            await Clients.Client(studentConnectionId).SendAsync("HandRejected");
        }

        private async Task UpdateHandStatus(int sessionId, HandStatus status)
        {
            var pending = _context.RaisedHands
                .Where(h => h.LiveSessionId == sessionId && h.status == HandStatus.Pending)
                .OrderByDescending(h => h.RaisedAt)
                .FirstOrDefault();

            if (pending is not null)
            {
                pending.status = status;
                await _context.SaveChangesAsync();
            }
        }

        public async Task SendChatMessage(string sessionId, string senderName, string message)
        {
            var sentAt = DateTime.UtcNow;

            var chat = new LiveChatMessage
            {
                LiveSessionId = int.Parse(sessionId),
                SenderId = Context.UserIdentifier ?? string.Empty,
                SenderName = senderName,
                Content = message
            };

            _context.LiveChatMessages.Add(chat);
            await _context.SaveChangesAsync();

            var history = _ChatHistory.GetOrAdd(sessionId, _ => new List<ChatEvent>());
            lock (history) history.Add(new ChatEvent(senderName, message, sentAt));

            await Clients.Group($"session-{sessionId}")
                .SendAsync("NewChatMessage", senderName, message, sentAt);
        }

        public async Task SendDrawEvent(string sessionId, double x, double y, bool isNewStroke)
        {
            var events = _WhiteboardHistory.GetOrAdd(sessionId, _ => new List<WhiteboardEvent>());
            lock (events) events.Add(new WhiteboardEvent(x, y, isNewStroke));

            await Clients.OthersInGroup($"session-{sessionId}")
                .SendAsync("DrawEvent", x, y, isNewStroke);
        }

        public async Task ClearWhiteboard(string sessionId)
        {
            _WhiteboardHistory.TryRemove(sessionId, out _);
            await Clients.Group($"session-{sessionId}").SendAsync("WhiteboardCleared");
        }

        public async Task NotifyScreenShareStarted(string sessionId) =>
            await Clients.OthersInGroup($"session-{sessionId}")
                .SendAsync("ShareScreenStarted", Context.ConnectionId);

        public async Task NotifyScreenShareStopped(string sessionId) =>
            await Clients.OthersInGroup($"session-{sessionId}")
                .SendAsync("ShareScreenStopped", Context.ConnectionId);

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            foreach (var kvp in _Participants)
            {
                lock (kvp.Value)
                {
                    kvp.Value.RemoveAll(x => x.ConnectionId == Context.ConnectionId);
                }
            }

            foreach (var kvp in _PendingRequests)
            {
                lock (kvp.Value)
                {
                    kvp.Value.RemoveAll(x => x.ConnectionId == Context.ConnectionId);
                }
            }

            foreach (var kvp in _CameraOffUsers)
            {
                lock (kvp.Value)
                {
                    kvp.Value.Remove(Context.ConnectionId);
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}