using Microsoft.EntityFrameworkCore;
using StreamVault.Domain.Domain;
using StreamVault.Domain.Entities;

namespace StreamVault.Application.Interfaces
{
    public interface IAppDbContext
    {
        public DbSet<Course> Courses { get; }
        public DbSet<Video> Videos { get; }
        public DbSet<Subscription> Subscriptions { get; }
        public DbSet<WatchProgress> WatchProgresses { get; }
        public DbSet<LiveSession> LiveSessions { get; }
        public DbSet<RaisedHand> RaisedHands { get; }
        public DbSet<LiveChatMessage> LiveChatMessages { get; }
        public DbSet<Payment> Payments { get; }
        public DbSet<StudyFile> StudyFiles { get; }
        public DbSet<Review> Reviews { get; }
        public DbSet<Floor> Floors { get; }
        public DbSet<Instructor> Users { get; }
        public DbSet<TeacherWallet> TeacherWallets { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}