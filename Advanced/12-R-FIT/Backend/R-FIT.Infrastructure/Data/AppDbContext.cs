using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using R_FIT.Application.Interfaces;
using R_FIT.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace R_FIT.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<PlatformProfile> PlatformProfiles { get; set; } = null!;
        public DbSet<Post> Posts { get; set; } = null!;
        public DbSet<PostTarget> PostTargets { get; set; } = null!;
        //public DbSet<PostEditHistory> PostEditHistories { get; set; } = null!;
        public DbSet<MediaFile> MediaFiles { get; set; } = null!;
        public DbSet<Comment> Comments { get; set; } = null!;
        public DbSet<Reaction> Reactions { get; set; } = null!;
        public DbSet<Share> Shares { get; set; } = null!;
        public DbSet<Follow> Follows { get; set; } = null!;
        public DbSet<Block> Blocks { get; set; } = null!;
        public DbSet<SilentMode> SilentModes { get; set; } = null!;
        public DbSet<QuietHoursSetting> QuietHoursSettings { get; set; } = null!;
        //public DbSet<MutedUser> MutedUsers { get; set; } = null!;
        //public DbSet<CloseFriend> CloseFriends { get; set; } = null!;

        public DbSet<Story> Stories { get; set; } = null!;
        public DbSet<StoryView> StoryViews { get; set; } = null!;
        //public DbSet<Highlight> Highlights { get; set; } = null!;
        //public DbSet<HighlightItem> HighlightItems { get; set; } = null!;
        //public DbSet<MusicTrack> MusicTracks { get; set; } = null!;

        public DbSet<DirectMessage> DirectMessages { get; set; } = null!;
        //public DbSet<Conversation> Conversations { get; set; } = null!;
        //public DbSet<ChatMessage> ChatMessages { get; set; } = null!;
        //public DbSet<Call> Calls { get; set; } = null!;

        public DbSet<UserSettings> UserSettings { get; set; } = null!;
        //public DbSet<TwoFactorSetting> TwoFactorSettings { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;
        public DbSet<ProfileVisit> ProfileVisits { get; set; } = null!;
        //public DbSet<ActivityLog> ActivityLogs { get; set; } = null!;

        //public DbSet<Group> Groups { get; set; } = null!;
        //public DbSet<GroupMember> GroupMembers { get; set; } = null!;
        //public DbSet<Page> Pages { get; set; } = null!;
        //public DbSet<PageFollower> PageFollowers { get; set; } = null!;
        //public DbSet<AdCampaign> AdCampaigns { get; set; } = null!;

        //public DbSet<Poll> Polls { get; set; } = null!;
        //public DbSet<PollOption> PollOptions { get; set; } = null!;
        //public DbSet<PollVote> PollVotes { get; set; } = null!;

        public DbSet<Hashtag> Hashtags { get; set; } = null!;
        public DbSet<PostHashtag> PostHashtags { get; set; } = null!;
        public DbSet<Bookmark> Bookmarks { get; set; } = null!;
        //public DbSet<Collection> Collections { get; set; } = null!;
        //public DbSet<CollectionItem> CollectionItems { get; set; } = null!;
        //public DbSet<SavedSearch> SavedSearches { get; set; } = null!;

        //public DbSet<Report> Reports { get; set; } = null!;
        //public DbSet<VerificationRequest> VerificationRequests { get; set; } = null!;
        //public DbSet<Badge> Badges { get; set; } = null!;
        //public DbSet<UserBadge> UserBadges { get; set; } = null!;
        //public DbSet<ReferralCode> ReferralCodes { get; set; } = null!;

        //public DbSet<LiveStream> LiveStreams { get; set; } = null!;
        //public DbSet<LiveStreamViewer> LiveStreamViewers { get; set; } = null!;
        //public DbSet<LiveStreamChatMessage> LiveStreamChatMessages { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Post>().HasOne(p => p.Author).WithMany().HasForeignKey(p => p.AuthorId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Comment>().HasOne(c => c.Author).WithMany().HasForeignKey(c => c.AuthorId).OnDelete(DeleteBehavior.Restrict);
            //modelBuilder.Entity<Group>().HasIndex(g => g.CreatorId);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Follow>().HasIndex(f => new { f.FollowerId, f.FollowingId }).IsUnique();
            modelBuilder.Entity<Bookmark>().HasIndex(b => new { b.UserId, b.PostId }).IsUnique();
            modelBuilder.Entity<Reaction>().HasIndex(r => new { r.UserId, r.PostId }).IsUnique();
            //modelBuilder.Entity<GroupMember>().HasIndex(m => new { m.GroupId, m.UserId }).IsUnique();
            //modelBuilder.Entity<PageFollower>().HasIndex(f => new { f.PageId, f.UserId }).IsUnique();
            //modelBuilder.Entity<PollVote>().HasIndex(v => v.VoterId);

            //modelBuilder.Entity<AdCampaign>().Property(c => c.Budget).HasPrecision(10, 2);
        }
    }
}
