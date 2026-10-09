using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Infrastructure.Hubs
{
    public interface IUserConnectionTracker
    {
        void AddConnection(string userId, string connectionId);
        void RemoveConnection(string userId, string connectionId);
        bool IsOnline(string userId);
        int OnlineUsersCount { get; }
    }

    public class UserConnectionTracker: IUserConnectionTracker 
    {
        private readonly ConcurrentDictionary<string, HashSet<string>> _connections = new();

        public void AddConnection(string userId, string connectionId)
        {
            var set = _connections.GetOrAdd(userId, _ => new HashSet<string>());
            lock (set) { set.Add(connectionId); }
        }

        public void RemoveConnection(string userId, string connectionId)
        {
            if (!_connections.TryGetValue(userId, out var set)) return;
            lock(set)
            {
                set.Remove(connectionId);
                if (set.Count == 0) _connections.TryRemove(userId, out _);
            }
        }

        public bool IsOnline(string userId) => _connections.ContainsKey(userId);
        public int OnlineUsersCount => _connections.Count;
    }
}
